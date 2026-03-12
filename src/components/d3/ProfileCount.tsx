"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import useSupabase from "@/hooks/supabaseHooks";

const ProfileCount = () => {
  const { getTotalProfilesCount } = useSupabase();
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCount = async () => {
      try {
        const total = await getTotalProfilesCount();
        if (!isMounted) return;
        setCount(total);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCount();

    return () => {
      isMounted = false;
    };
  }, [getTotalProfilesCount]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Clear previous render
    container.innerHTML = "";

    if (loading || count === null) {
      // Simple skeleton shimmer while loading
      const skeleton = document.createElement("div");
      skeleton.className =
        "animate-pulse w-full h-full rounded-2xl bg-gradient-to-br from-slate-900/40 via-slate-800/40 to-slate-900/40";
      container.appendChild(skeleton);
      return;
    }

    const width = 260;
    const height = 260;
    const radius = Math.min(width, height) / 2 - 20;

    const svg = d3
      .select(container)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("role", "img")
      .attr("aria-label", `Total profiles created: ${count}`);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Background glow
    const defs = svg.append("defs");
    const grad = defs
      .append("radialGradient")
      .attr("id", "profileCountGlow")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");

    grad
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#38bdf8")
      .attr("stop-opacity", 0.45);
    grad
      .append("stop")
      .attr("offset", "70%")
      .attr("stop-color", "#0f172a")
      .attr("stop-opacity", 0);

    g.append("circle")
      .attr("r", radius + 18)
      .attr("fill", "url(#profileCountGlow)")
      .attr("opacity", 0.8);

    // Base ring
    const baseArc = d3
      .arc<d3.DefaultArcObject>()
      .innerRadius(radius - 12)
      .outerRadius(radius + 2)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    g.append("path")
      .datum<d3.DefaultArcObject>({
        startAngle: 0,
        endAngle: 2 * Math.PI,
        innerRadius: radius - 12,
        outerRadius: radius + 2,
      })
      .attr("d", baseArc)
      .attr("fill", "#020617")
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 1.5)
      .attr("fill-opacity", 0.9);

    // Foreground arc (animated)
    const maxValue = Math.max(10, Math.ceil(count / 10) * 10);
    const valueScale = d3
      .scaleLinear()
      .domain([0, maxValue])
      .range([0, 2 * Math.PI]);

    const foregroundArc = d3
      .arc<d3.DefaultArcObject>()
      .innerRadius(radius - 10)
      .outerRadius(radius)
      .startAngle(0);

    const arcPath = g
      .append("path")
      .datum<d3.DefaultArcObject>({
        startAngle: 0,
        endAngle: 0,
        innerRadius: radius - 10,
        outerRadius: radius,
      })
      .attr("fill", "url(#profileCountStroke)");

    // Gradient for arc stroke
    const strokeGrad = defs
      .append("linearGradient")
      .attr("id", "profileCountStroke")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    strokeGrad
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#38bdf8");
    strokeGrad
      .append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "#22c55e");
    strokeGrad
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#eab308");

    // Center numeric label
    const valueText = g
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.1em")
      .attr("fill", "#e5e7eb")
      .attr("font-weight", 800)
      .attr("font-size", 42)
      .style("font-variant-numeric", "tabular-nums")
      .style("text-shadow", "0 0 16px rgba(15,23,42,0.9)");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "2.5em")
      .attr("fill", "#9ca3af")
      .attr("font-size", 12)
      .attr("letter-spacing", 1.6)
      .text("RESUMES CREATED");

    // Sub-label hint
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "4.1em")
      .attr("fill", "#4b5563")
      .attr("font-size", 10)
      .text("Number of resumes created by users");

    // Motion: arc + numeric count-up
    const duration = 900;

    arcPath
      .transition()
      .duration(duration)
      .ease(d3.easeCubicOut)
      .attrTween("d", (d) => {
        const interpolateAngle = d3.interpolate(0, valueScale(count));
        const interpolateValue = d3.interpolate(0, count);

        return (t: number) => {
          const currentAngle = interpolateAngle(t);
          const currentValue = Math.round(interpolateValue(t));

          valueText.text(currentValue.toLocaleString());

          return foregroundArc({
            ...d,
            endAngle: currentAngle,
          }) as string;
        };
      });

    // Ambient rotating ticks around the ring
    const tickCount = 48;
    const ticks = d3.range(tickCount).map((i) => ({
      angle: (i / tickCount) * 2 * Math.PI,
    }));

    const tickGroup = g
      .append("g")
      .attr("class", "ambient-ticks")
      .attr("opacity", 0.6);

    tickGroup
      .selectAll("rect")
      .data(ticks)
      .join("rect")
      .attr("x", -0.8)
      .attr("width", 1.6)
      .attr("y", -radius - 6)
      .attr("height", 10)
      .attr("rx", 1)
      .attr("fill", "#0ea5e9")
      .attr("fill-opacity", 0.2)
      .attr("transform", (d) => `rotate(${(d.angle * 180) / Math.PI})`)
      .transition()
      .duration(9000)
      .ease(d3.easeLinear)
      .attrTween("transform", (d) => {
        const start = d.angle;
        const end = d.angle + 2 * Math.PI;
        return (t) => {
          const a = start + (end - start) * t;
          return `rotate(${(a * 180) / Math.PI})`;
        };
      })
      .on("end", function () {
        // Loop rotation for a subtle, continuous motion
        d3.select(this as SVGRectElement)
          .transition()
          .duration(9000)
          .ease(d3.easeLinear)
          .attrTween("transform", function () {
            const prev = 2 * Math.PI;
            const next = 4 * Math.PI;
            return (t) => {
              const a = prev + (next - prev) * t;
              return `rotate(${(a * 180) / Math.PI})`;
            };
          })
          .on("end", () => {});
      });

    return () => {
      container.innerHTML = "";
    };
  }, [loading, count]);

  return (
    <div
      ref={mountRef}
      className="relative w-full max-w-xs sm:max-w-sm mx-auto h-64 sm:h-72 md:h-80 flex items-center justify-center"
    />
  );
};

export default ProfileCount;
