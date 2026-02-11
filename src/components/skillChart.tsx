"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";

type Skill = {
  name: string;
  level: number;
};

export default function SkillChart({ skills }: { skills: Skill[] }) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current || !skills) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 300;
    const barHeight = 28;

    svg.attr("width", width).attr("height", skills.length * barHeight);

    const x = d3.scaleLinear().domain([0, 100]).range([0, width]);

    const bars = svg
      .selectAll("rect")
      .data(skills)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (_, i) => i * barHeight)
      .attr("width", 0)
      .attr("height", 18)
      .attr("rx", 6)
      .attr("fill", "#3b82f6");

    bars
      .transition()
      .duration(1200)
      .delay((_, i) => i * 120)
      .attr("width", (d) => x(d.level));
  }, [skills]);

  return <svg ref={ref} className="mt-6" />;
}
