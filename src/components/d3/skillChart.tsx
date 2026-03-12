"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Skill {
  name: string;
  level: number; // 0-100
}

// Revamped D3.js chart replacing Three.js: responsive, accessible, and high-contrast.
export default function SkillAmbient3D({
  skills,
  colorProfile,
}: {
  skills: Skill[];
  colorProfile: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  console.log(colorProfile);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Ensure container hides overflow on very small screens
    container.style.overflow = "hidden";

    // Define color profiles for light and dark themes
    const colorProfiles: Record<string, string[]> = {
      light: ["#93c5fd", "#60a5fa", "#3b82f6", "#2563eb"], // Updated to pastel blue shades
      dark: ["#ef4444", "#f59e0b", "#84cc16", "#22c55e"],
    };

    const backgroundColors: Record<string, string> = {
      light: "#ffffff", // Updated to white background for light mode
      dark: "#1e293b", // Dark background for dark mode
    };

    // Apply background color based on the theme
    container.style.backgroundColor =
      backgroundColors[colorProfile] || "#ffffff";

    // Render function for full redraw (responsive)
    const renderChart = () => {
      const data = [...skills].sort((a, b) => b.level - a.level);
      container.innerHTML = "";

      // Dimensions — adapt to small screens
      const rect = container.getBoundingClientRect();
      const width = Math.max(280, rect.width || 320);
      const height = Math.max(220, Math.min(560, rect.height || 320));

      // Compute longest label length to adjust left margin dynamically
      const longestLabel = data.reduce(
        (max, d) => Math.max(max, d.name.length),
        0
      );

      // Compact margins for mobile
      const isNarrow = width < 420;
      const baseLeft = isNarrow ? 90 : 120;
      const extraLeft = Math.min(
        80,
        Math.max(0, (longestLabel - (isNarrow ? 12 : 16)) * (isNarrow ? 6 : 5))
      );
      const margin = isNarrow
        ? { top: 24, right: 12, bottom: 38, left: baseLeft + extraLeft }
        : { top: 30, right: 18, bottom: 44, left: baseLeft + extraLeft };
      const innerWidth = Math.max(1, width - margin.left - margin.right);
      const innerHeight = Math.max(1, height - margin.top - margin.bottom);

      const svg = d3
        .select(container)
        .append("svg")
        // Make SVG truly responsive to container
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("role", "img")
        .attr("aria-label", "Skill levels bar chart");

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Define clip path to prevent overflowing grid/bars into margins
      const clipId = `clip-${Math.random().toString(36).slice(2)}`;
      svg
        .append("clipPath")
        .attr("id", clipId)
        .append("rect")
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("width", innerWidth)
        .attr("height", innerHeight);

      const x = d3.scaleLinear().domain([0, 100]).range([0, innerWidth]).nice();
      const y = d3
        .scaleBand<string>()
        .domain(data.map((d) => d.name))
        .range([0, innerHeight])
        .paddingInner(isNarrow ? 0.25 : 0.2)
        .paddingOuter(isNarrow ? 0.08 : 0.05);

      const selectedColors = colorProfiles[colorProfile] || colorProfiles.dark;

      const color = d3
        .scaleThreshold<number, string>()
        .domain([30, 60, 80])
        .range(selectedColors);

      // Grid (clipped)
      g.append("g")
        .attr("class", "x-grid")
        .attr("clip-path", `url(#${clipId})`)
        .call(
          d3
            .axisTop(x)
            .ticks(Math.max(2, Math.floor(innerWidth / (isNarrow ? 180 : 140))))
            .tickSize(-innerHeight)
            .tickPadding(isNarrow ? 4 : 6)
            .tickFormat((d) => `${+d}%`)
        )
        .call((g) =>
          g
            .selectAll("text")
            .attr("fill", "#a0aec0")
            .attr("font-size", isNarrow ? 10 : 12)
        )
        .call((g) =>
          g
            .selectAll("line")
            .attr("stroke", "#334155")
            .attr("stroke-opacity", 0.3)
        )
        .call((g) => g.select(".domain").remove());

      const bars = g
        .selectAll<SVGRectElement, Skill>("rect")
        .data<Skill>(data as Skill[], (d: Skill) => d.name)
        .join("g")
        .attr("class", "bar")
        .attr("transform", (d) => `translate(0,${y(d.name)})`);

      const corner = Math.min(10, y.bandwidth() / 3);
      bars
        .append("rect")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("rx", corner)
        .attr("ry", corner)
        .attr("fill", (d) => color(d.level))
        .attr("fill-opacity", 0.9)
        .attr("stroke", "#0f172a")
        .attr("stroke-opacity", 0.15)
        .attr("width", 0)
        .transition()
        .duration(500)
        .ease(d3.easeCubicOut)
        .attr("width", (d) => x(d.level));

      // Value labels — switch to outside on very short bars
      bars
        .append("text")
        .attr("class", "value-label")
        .attr("y", y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("font-weight", 700)
        .attr("font-size", Math.min(16, Math.max(11, y.bandwidth() * 0.45)))
        .text((d) => `${d.level}%`)
        .attr("x", (d) => x(d.level) - (isNarrow ? 6 : 8))
        .attr("text-anchor", "end")
        .attr("fill", "#f8fafc")
        .style("filter", "drop-shadow(0 1px 1px rgba(0,0,0,0.6))")
        .filter((d) => x(d.level) < 40)
        .attr("x", (d) => x(d.level) + 6)
        .attr("text-anchor", "start")
        .attr("fill", "#e2e8f0");

      // Left labels — smaller on narrow screens, ellipsis
      const leftLabels = svg
        .append("g")
        .attr("transform", `translate(${margin.left - 8},${margin.top})`);

      leftLabels
        .selectAll("text")
        .data(data)
        .join("text")
        .attr("x", 0)
        .attr("y", (d) => (y(d.name) ?? 0) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("fill", { light: "#334155", dark: "#cbd5e1" }[colorProfile] || "#cbd5e1")
        .attr("font-weight", 600)
        .attr(
          "font-size",
          isNarrow ? 12 : Math.min(16, Math.max(12, y.bandwidth() * 0.45))
        )
        .text((d) => d.name)
        .each(function () {
          const self = d3.select(this);
          const text = self.text();
          const limit = isNarrow ? 14 : 20;
          if ((text?.length ?? 0) > limit) {
            self.text(text.slice(0, limit - 2) + "…");
          }
        })
        .style("filter", "drop-shadow(0 1px 1px rgba(0,0,0,0.5))");

      // Bottom axis (reduce ticks and padding on narrow screens)
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .attr("clip-path", `url(#${clipId})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(Math.max(2, Math.floor(innerWidth / (isNarrow ? 180 : 140))))
            .tickPadding(isNarrow ? 4 : 6)
            .tickFormat((d) => `${+d}%`)
        )
        .call((g) =>
          g
            .selectAll("text")
            .attr("fill", "#cbd5e1")
            .attr("font-size", isNarrow ? 10 : 12)
        )
        .call((g) => g.select("path").attr("stroke", "#334155"));

      // Title
      svg
        .append("text")
        .attr("x", margin.left)
        .attr("y", isNarrow ? 18 : 22)
        .attr("fill", "#ffffff")
        .attr("font-size", isNarrow ? 16 : 18)
        .attr("font-weight", 700)
        .text("Skills");
    };

    renderChart();

    // Debounced resize to re-render responsively
    let resizeTimer: number | undefined;
    const onResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        renderChart();
      }, 120);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      container.innerHTML = "";
    };
  }, [skills]);

  return (
    <div
      ref={mountRef}
      className="relative w-full max-w-full h-80 md:h-96 lg:h-112 rounded-xl bg-[rgb(5,9,18)]/60 backdrop-blur-sm ring-1 ring-slate-700/40 p-2"
    />
  );
}
