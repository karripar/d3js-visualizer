"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import profile from "@/data/profile.json";

export default function SkillChart() {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 300;
    const barHeight = 25;

    svg
      .attr("width", width)
      .attr("height", profile.skills.length * barHeight);

    svg
      .selectAll("rect")
      .data(profile.skills)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (_, i) => i * barHeight)
      .attr("width", (d) => d.level * 2)
      .attr("height", 18)
      .attr("rx", 4)
      .attr("fill", "#3b82f6"); // Tailwind blue-500
  }, []);

  return <svg ref={ref} className="mt-4" />;
}
