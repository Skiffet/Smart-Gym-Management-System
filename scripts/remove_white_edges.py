#!/usr/bin/env python3
"""
Remove near-white background from activity PNGs by flood-filling from image edges.
Outputs RGBA PNGs with transparency (no CSS hacks needed).
"""
from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

from PIL import Image


def color_dist(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5


def flood_transparent_rgba(
    img: Image.Image,
    *,
    white_thresh: int = 235,
    max_dist: float = 38.0,
) -> Image.Image:
    """Mark edge-connected near-white pixels transparent (keeps interior whites)."""
    rgba = img.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()

    def is_seed(r: int, g: int, b: int, a: int) -> bool:
        if a < 10:
            return False
        return r >= white_thresh and g >= white_thresh and b >= white_thresh

    seeds: list[tuple[int, int]] = []
    for x in range(w):
        for y in (0, h - 1):
            r, g, b, a = px[x, y]
            if is_seed(r, g, b, a):
                seeds.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            r, g, b, a = px[x, y]
            if is_seed(r, g, b, a):
                seeds.append((x, y))

    if not seeds:
        return rgba

    ref = px[seeds[0][0], seeds[0][1]][:3]
    visited = set()
    q: deque[tuple[int, int]] = deque()

    for sx, sy in seeds:
        if (sx, sy) not in visited:
            visited.add((sx, sy))
            q.append((sx, sy))

    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if nx < 0 or ny < 0 or nx >= w or ny >= h:
                continue
            if (nx, ny) in visited:
                continue
            r, g, b, a = px[nx, ny]
            if a < 10:
                continue
            if color_dist((r, g, b), ref) <= max_dist:
                visited.add((nx, ny))
                q.append((nx, ny))

    out = rgba.copy()
    opx = out.load()
    for x, y in visited:
        r, g, b, a = opx[x, y]
        opx[x, y] = (r, g, b, 0)

    return out


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    targets = [
        root / "frontend" / "public" / "image" / f
        for f in ("aquatic.png", "cardio.png", "climbing.png", "strength.png")
    ]
    for path in targets:
        if not path.exists():
            print(f"skip missing: {path}", file=sys.stderr)
            continue
        im = Image.open(path)
        out = flood_transparent_rgba(im)
        out.save(path, format="PNG", optimize=True)
        print(f"ok: {path.relative_to(root)}")


if __name__ == "__main__":
    main()
