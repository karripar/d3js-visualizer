"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { JobExperience } from "@/types/LocalTypes";

interface ExperiencesChartProps {
  experiences: JobExperience[];
  colorProfile: "light" | "dark";
}

interface ExperienceInternal extends JobExperience {
  start: Date;
  end: Date;
  lane: number;
}

// Interactive horizontal timeline of experiences with hover details.
export default function ExperiencesChart({
  experiences,
  colorProfile,
}: ExperiencesChartProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    container.innerHTML = "";
    container.style.overflow = "hidden";

    if (!experiences || experiences.length === 0) {
      const empty = document.createElement("div");
      empty.className =
        "flex h-full items-center justify-center text-sm text-slate-400";
      empty.textContent = "Add experiences to see your career timeline";
      container.appendChild(empty);
      return;
    }

    const parsedBase = experiences
      .map<ExperienceInternal | null>((d, index) => {
        const start = new Date(d.startDate);
        const end = d.endDate ? new Date(d.endDate) : new Date();
        if (Number.isNaN(start.getTime())) return null;
        return {
          ...d,
          start,
          end,
          lane: index % 3, // temporary, recomputed after sort
        };
      })
      .filter((d): d is ExperienceInternal => d !== null);

    if (!parsedBase.length) return;

    const rect = container.getBoundingClientRect();
    const width = Math.max(320, rect.width || 360);
    const height = Math.max(220, rect.height || 260);

    const isNarrow = width < 640;
    const margin = isNarrow
      ? { top: 40, right: 20, bottom: 60, left: 40 }
      : { top: 48, right: 40, bottom: 60, left: 60 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const bg = colorProfile === "light" ? "#ffffff" : "#020617";
    container.style.backgroundColor = bg;

    const svg = d3
      .select(container)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("role", "img")
      .attr("aria-label", "Career experiences timeline");

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const minDate = d3.min(parsedBase, (d) => d.start)!;
    const maxDate = d3.max(parsedBase, (d) => d.end)!;

    const x = d3
      .scaleTime()
      .domain([
        d3.timeMonth.offset(minDate, -1),
        d3.timeMonth.offset(maxDate, 1),
      ])
      .range([0, innerWidth]);

    const lanes = Math.min(3, Math.max(1, parsedBase.length));
    const laneHeight = innerHeight / lanes;
    const laneY = (i: number) => i * laneHeight + laneHeight / 2;

    const timelineY = innerHeight / 2;

    const axis = g
      .append("g")
      .attr("transform", `translate(0,${timelineY})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(isNarrow ? 4 : 6)
          .tickSizeOuter(0)
      );

    axis
      .selectAll<SVGTextElement, Date>("text")
      .attr("fill", colorProfile === "light" ? "#0f172a" : "#cbd5e1")
      .attr("font-size", isNarrow ? 10 : 11);

    axis
      .selectAll<SVGLineElement, Date>("line")
      .attr("stroke", colorProfile === "light" ? "#e2e8f0" : "#334155");

    axis
      .select<SVGPathElement>("path")
      .attr("stroke", colorProfile === "light" ? "#cbd5e1" : "#475569");

    const color = d3
      .scaleSequential<string>()
      .domain([0, parsedBase.length - 1])
      .interpolator(
        colorProfile === "light" ? d3.interpolateCool : d3.interpolateTurbo
      );

    const tooltip = d3
      .select(container)
      .append("div")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("background", "rgba(15,23,42,0.96)")
      .style("color", "#e5e7eb")
      .style("padding", "8px 10px")
      .style("border-radius", "0.5rem")
      .style("font-size", "12px")
      .style("box-shadow", "0 10px 30px rgba(15,23,42,0.6)")
      .style("opacity", 0)
      .style("z-index", "50");

    const tooltipOffsetX = 8;
    const tooltipOffsetY = 18;

    const updateTooltipPosition = (event: MouseEvent) => {
      const containerRect = container.getBoundingClientRect();
      const [mx, my] = d3.pointer(event, container);

      // Start with tooltip to the right of the cursor
      let left = mx + tooltipOffsetX;
      let top = my + tooltipOffsetY;

      // Prevent tooltip from going above the top of the container
      if (top < 8) top = 8;

      // Temporarily set position so we can measure width
      tooltip.style("left", `${left}px`).style("top", `${top}px`);
      const tooltipNode = tooltip.node() as HTMLDivElement | null;
      const tooltipWidth = tooltipNode?.offsetWidth ?? 0;

      // If the tooltip would overflow the right edge, flip it to the left
      const overflowRight = left + tooltipWidth > containerRect.width - 8;
      if (overflowRight) {
        left = mx - tooltipWidth - tooltipOffsetX;
        if (left < 8) left = 8; // clamp to left padding
      }

      tooltip.style("left", `${left}px`).style("top", `${top}px`);
    };

    const experiencesSorted: ExperienceInternal[] = parsedBase
      .slice()
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .map((d, i) => ({ ...d, lane: i % lanes }));

    const groups = g
      .selectAll<SVGGElement, ExperienceInternal>(".experience")
      .data(experiencesSorted, (d) => `${d.company}-${d.role}-${d.startDate}`)
      .join("g")
      .attr("class", "experience")
      .attr("transform", (d) => `translate(0,${laneY(d.lane)})`);

    const baseRadius = Math.min(12, Math.max(6, laneHeight * 0.18));

    groups
      .append("line")
      .attr("x1", (d) => x(d.start))
      .attr("x2", (d) => x(d.start))
      .attr("stroke", (_d, i) => color(i))
      .attr("stroke-width", Math.max(4, laneHeight * 0.16))
      .attr("stroke-linecap", "round")
      .attr("opacity", 0.7)
      .transition()
      .duration(700)
      .ease(d3.easeCubicOut)
      .attr("x2", (d) => x(d.end));

    groups
      .append("circle")
      .attr("cx", (d) => x(d.start))
      .attr("cy", 0)
      .attr("r", 0)
      .attr("fill", (_d, i) => color(i))
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 1.5)
      .transition()
      .duration(500)
      .attr("r", baseRadius);

    groups
      .append("text")
      .attr("x", (d) => x(d.start) + (isNarrow ? 6 : 10))
      .attr("y", -6)
      .attr("fill", colorProfile === "light" ? "#0f172a" : "#e5e7eb")
      .attr("font-size", isNarrow ? 11 : 12)
      .attr("font-weight", 600)
      .text((d) => d.role)
      .each(function () {
        const self = d3.select(this as SVGTextElement);
        const text = self.text();
        const maxChars = isNarrow ? 18 : 26;
        if (text.length > maxChars) {
          self.text(text.slice(0, maxChars - 1) + "…");
        }
      });

    groups
      .append("text")
      .attr("x", (d) => x(d.start) + (isNarrow ? 6 : 10))
      .attr("y", isNarrow ? 8 : 10)
      .attr("fill", colorProfile === "light" ? "#64748b" : "#94a3b8")
      .attr("font-size", 11)
      .text((d) => d.company);

    const dateFormatter = new Intl.DateTimeFormat("en", {
      month: "short",
      year: "numeric",
    });

    const formatRange = (d: ExperienceInternal): string => {
      const s = dateFormatter.format(d.start);
      const e = d.endDate ? dateFormatter.format(d.end) : "Present";
      return `${s} – ${e}`;
    };

    groups
      .on("mouseenter", function (event: MouseEvent, d: ExperienceInternal) {
        updateTooltipPosition(event);

        d3.select(this)
          .select<SVGLineElement>("line")
          .transition()
          .duration(180)
          .attr("stroke-width", Math.max(6, laneHeight * 0.22))
          .attr("opacity", 0.95);

        d3.select(this)
          .select<SVGCircleElement>("circle")
          .transition()
          .duration(180)
          .attr("r", baseRadius * 1.3);

        const description = d.description ?? "";

        tooltip.style("opacity", 1).html(() => {
          const title = d.role || "Untitled role";
          const company = d.company ? ` @ ${d.company}` : "";
          const descHtml = description
            ? `<div class="mt-1 text-xs text-slate-300 max-w-xs">${description}</div>`
            : "";
          return `
              <div class="font-semibold text-xs text-slate-100">${title}${company}</div>
              <div class="text-[10px] uppercase tracking-wide text-slate-400 mt-0.5">${formatRange(
                d
              )}</div>
              ${descHtml}
            `;
        });
      })
      .on("mousemove", function (event: MouseEvent) {
        updateTooltipPosition(event);
      })
      .on("mouseleave", function () {
        d3.select(this)
          .select<SVGLineElement>("line")
          .transition()
          .duration(150)
          .attr("stroke-width", Math.max(4, laneHeight * 0.16))
          .attr("opacity", 0.7);

        d3.select(this)
          .select<SVGCircleElement>("circle")
          .transition()
          .duration(150)
          .attr("r", baseRadius);

        tooltip.style("opacity", 0);
      });

    svg
      .append("text")
      .attr("x", margin.left)
      .attr("y", margin.top - 16)
      .attr("fill", colorProfile === "light" ? "#0f172a" : "#e5e7eb")
      .attr("font-size", 16)
      .attr("font-weight", 700)
      .text("Experience timeline");

    svg
      .append("text")
      .attr("x", width - margin.right)
      .attr("y", height - 16)
      .attr("text-anchor", "end")
      .attr("fill", colorProfile === "light" ? "#94a3b8" : "#64748b")
      .attr("font-size", 11)
      .text("Hover each segment to see details");

    return () => {
      container.innerHTML = "";
    };
  }, [experiences, colorProfile]);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-80 md:h-96 lg:h-[26rem] rounded-xl bg-slate-950/70 backdrop-blur-sm ring-1 ring-slate-700/40 p-3"
    />
  );
}
