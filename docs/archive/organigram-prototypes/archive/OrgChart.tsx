"use client";

/**
 * Interactive Organizational Chart Component
 *
 * Features:
 * - Expand/collapse nodes
 * - Zoom and pan
 * - Search and highlight
 * - Click to view member details
 * - Responsive mobile layout
 * - Custom KCVV branding
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { OrgChart as D3OrgChart } from "d3-org-chart";
import type { OrgChartNode, OrgChartConfig } from "@/types/organigram";
import type { HierarchyNode } from "d3-hierarchy";

interface ExtendedHierarchyNode extends HierarchyNode<OrgChartNode> {
  _children?: this[];
  _expanded?: boolean;
}

interface OrgChartProps {
  data: OrgChartNode[];
  config?: OrgChartConfig;
  onNodeClick?: (node: OrgChartNode) => void;
  className?: string;
}

/**
 * Renders an interactive organizational chart with search, zoom/pan, expand/collapse, and fullscreen controls.
 *
 * The chart is built from the provided node data and includes UI controls for searching/highlighting nodes,
 * zooming, expanding/collapsing nodes, and toggling fullscreen. Clicking a node will toggle its expansion when it has
 * children and will invoke `onNodeClick` with that node's data if provided.
 *
 * @param data - Array of organization nodes to render in the chart
 * @param config - Optional configuration (e.g., `initialZoom`, `expandToDepth`) that controls initial zoom and expansion behavior
 * @param onNodeClick - Optional callback invoked with a node's data when that node is clicked
 * @param className - Optional additional class name applied to the chart wrapper
 * @returns The JSX element containing the rendered organizational chart
 */
export function OrgChart({
  data,
  config = {},
  onNodeClick,
  className = "",
}: OrgChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<D3OrgChart<OrgChartNode> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    // Copy ref for cleanup
    const containerElement = chartRef.current;

    // Create new chart instance
    const chart = new D3OrgChart<OrgChartNode>();

    chartInstance.current = chart
      .container("#org-chart-container")
      .data(data)
      .nodeWidth(() => 280)
      .nodeHeight(() => 140)
      .childrenMargin(() => 50)
      .compactMarginBetween(() => 40)
      .compactMarginPair(() => 30)
      .neighbourMargin(() => 40)
      .siblingsMargin(() => 40)
      .initialZoom(config.initialZoom || 0.7)
      .scaleExtent([0.3, 3]) // Allow zoom from 30% to 300%
      .onNodeClick((node: unknown) => {
        // Toggle expand/collapse on click (more accessible than tiny button)
        const d = node as ExtendedHierarchyNode;
        if (d.children || d._children) {
          if (d._expanded === false) {
            chartInstance.current?.setExpanded(d.data.id).render();
          } else {
            chartInstance.current?.setExpanded(d.data.id, false).render();
          }
        }
        // Also trigger the detail modal
        if (onNodeClick) {
          const d3Node = node as HierarchyNode<OrgChartNode>;
          onNodeClick(d3Node.data);
        }
      })
      // Custom node template with KCVV branding
      .nodeContent((d: unknown) => {
        const typedNode = d as ExtendedHierarchyNode;
        const node = typedNode.data;
        const imageUrl = node.imageUrl || "/images/logo-flat.png";
        const hasChildren = typedNode.children || typedNode._children;

        return `
          <div class="org-node" style="
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            width: 280px;
            height: 140px;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
          ">
            <!-- Green accent bar -->
            <div style="
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #4acf52 0%, #41b147 100%);
              border-radius: 10px 10px 0 0;
            "></div>

            <div style="display: flex; gap: 12px; height: 100%;">
              <!-- Profile Image -->
              <div style="flex-shrink: 0;">
                <img
                  src="${imageUrl}"
                  alt="${node.name}"
                  style="
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid #4acf52;
                  "
                  onerror="this.src='/images/logo-flat.png'"
                />
              </div>

              <!-- Content -->
              <div style="
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                min-width: 0;
              ">
                <div style="
                  font-family: 'quasimoda', 'acumin-pro', 'Montserrat', sans-serif;
                  font-size: 16px;
                  font-weight: 700;
                  color: #31404b;
                  margin-bottom: 4px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                ">${node.name}</div>

                <div style="
                  font-family: 'montserrat', sans-serif;
                  font-size: 13px;
                  color: #62656A;
                  line-height: 1.4;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                ">${node.title}</div>

                ${
                  node.positionShort
                    ? `
                  <div style="
                    margin-top: 8px;
                    display: inline-block;
                    padding: 2px 8px;
                    background: rgba(74, 207, 82, 0.1);
                    color: #4acf52;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 600;
                    font-family: 'ibm-plex-mono', monospace;
                    letter-spacing: 0.5px;
                  ">${node.positionShort}</div>
                `
                    : ""
                }
              </div>
            </div>

            <!-- Expand/Collapse Indicator -->
            ${
              hasChildren
                ? `
              <div class="expand-indicator" style="
                position: absolute;
                bottom: 8px;
                right: 8px;
                width: 32px;
                height: 32px;
                background: #4acf52;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 20px;
                font-weight: bold;
                box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                pointer-events: none;
              ">
                ${typedNode._expanded === false ? "+" : "−"}
              </div>
            `
                : ""
            }

            <!-- Click hint for users -->
            ${
              hasChildren
                ? `
              <div style="
                position: absolute;
                bottom: 8px;
                left: 8px;
                font-size: 10px;
                color: #62656A;
                opacity: 0.7;
                pointer-events: none;
              ">
                Klik om ${typedNode._expanded === false ? "uit te klappen" : "in te klappen"}
              </div>
            `
                : ""
            }
          </div>
        `;
      })
      .render()
      .expandAll() // First expand all
      .fit(); // Fit to screen

    // Then collapse to configured depth
    if (config.expandToDepth) {
      setTimeout(() => {
        if (chartInstance.current) {
          // Collapse all first
          chartInstance.current.collapseAll();
          // Then expand to depth
          const expandToLevel = (depth: number) => {
            const expandRecursive = (
              nodes: ExtendedHierarchyNode[],
              level: number,
            ) => {
              if (level >= depth) return;
              nodes.forEach((node) => {
                // Check if node has children (either expanded or collapsed)
                if (node.children || node._children) {
                  chartInstance.current?.setExpanded(node.data.id);
                  if (node.children) {
                    expandRecursive(
                      node.children as ExtendedHierarchyNode[],
                      level + 1,
                    );
                  }
                }
              });
            };
            // Get root nodes (nodes with no parent)
            const allNodes = chartInstance.current?.getChartState()
              .allNodes as ExtendedHierarchyNode[];
            const rootNodes = allNodes?.filter((n) => !n.parent);

            if (rootNodes) {
              expandRecursive(rootNodes, 0);
            }
          };
          expandToLevel(config.expandToDepth ?? 1);
          chartInstance.current.fit().render();
        }
      }, 100);
    }

    // Cleanup
    return () => {
      if (chartInstance.current) {
        // d3-org-chart doesn't have explicit cleanup, but we clear the container
        if (containerElement) {
          containerElement.innerHTML = "";
        }
      }
    };
  }, [data, config, onNodeClick]);

  // Search functionality
  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      if (chartInstance.current && term) {
        chartInstance.current.clearHighlighting();
        const matchingNodes = data.filter(
          (node) =>
            node.name.toLowerCase().includes(term.toLowerCase()) ||
            node.title.toLowerCase().includes(term.toLowerCase()),
        );
        matchingNodes.forEach((node) => {
          chartInstance.current?.setHighlighted(node.id).render();
        });
      } else if (chartInstance.current) {
        chartInstance.current.clearHighlighting();
      }
    },
    [data],
  );

  // Expand/Collapse all
  const expandAll = useCallback(() => {
    if (chartInstance.current) {
      chartInstance.current.expandAll().fit().render();
    }
  }, []);

  const collapseAll = useCallback(() => {
    if (chartInstance.current) {
      chartInstance.current.collapseAll().fit().render();
    }
  }, []);

  // Zoom controls (more accessible than scroll wheel)
  const zoomIn = useCallback(() => {
    if (chartInstance.current) {
      chartInstance.current.zoomIn();
      chartInstance.current.render();
    }
  }, []);

  const zoomOut = useCallback(() => {
    if (chartInstance.current) {
      chartInstance.current.zoomOut();
      chartInstance.current.render();
    }
  }, []);

  const resetZoom = useCallback(() => {
    if (chartInstance.current) {
      chartInstance.current.fit().render();
    }
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!chartRef.current?.parentElement) return;

    if (!document.fullscreenElement) {
      chartRef.current.parentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className={`org-chart-wrapper ${className}`}>
      {/* Controls */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Zoek persoon of functie..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-green-main focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-gray-dark"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Zoom Controls */}
          <div className="flex gap-1 border border-gray-medium rounded-lg overflow-hidden">
            <button
              onClick={zoomOut}
              className="px-4 py-2 text-lg font-bold text-gray-dark hover:bg-gray-100 transition-colors"
              aria-label="Zoom out"
              title="Uitzoomen"
            >
              −
            </button>
            <button
              onClick={resetZoom}
              className="px-4 py-2 text-xs font-medium text-gray-dark border-x border-gray-light hover:bg-gray-100 transition-colors"
              title="Reset zoom"
            >
              Reset
            </button>
            <button
              onClick={zoomIn}
              className="px-4 py-2 text-lg font-bold text-gray-dark hover:bg-gray-100 transition-colors"
              aria-label="Zoom in"
              title="Inzoomen"
            >
              +
            </button>
          </div>

          {/* Expand/Collapse Controls */}
          <button
            onClick={expandAll}
            className="px-4 py-2 text-sm font-medium text-gray-dark border border-gray-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Alles uitklappen
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 text-sm font-medium text-gray-dark border border-gray-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Alles inklappen
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="px-4 py-2 text-sm font-medium text-green-main border border-green-main rounded-lg hover:bg-green-main hover:text-white transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <span>Verlaat volledig scherm</span>
            ) : (
              <span>Volledig scherm</span>
            )}
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div
        id="org-chart-container"
        ref={chartRef}
        className="org-chart-container w-full h-full rounded-lg border border-gray-light shadow-sm"
        style={{
          minHeight: "600px",
          width: "100%",
          overflow: "hidden",
        }}
      />

      {/* Custom Styles */}
      <style jsx global>{`
        .org-chart-wrapper .org-node {
          cursor: pointer !important;
          transition: all 0.3s ease !important;
        }

        .org-chart-wrapper .org-node:hover {
          border-color: #4acf52 !important;
          box-shadow: 0 6px 20px rgba(74, 207, 82, 0.3) !important;
          transform: translateY(-4px) !important;
        }

        .org-chart-wrapper .expand-indicator {
          transition: transform 0.2s ease !important;
        }

        .org-chart-wrapper .org-node:hover .expand-indicator {
          transform: scale(1.15) !important;
          background: #41b147 !important;
        }

        /* Responsive adjustments */
        @media (max-width: 960px) {
          .org-chart-container {
            min-height: 400px !important;
          }
        }

        /* Fullscreen styles */
        .org-chart-wrapper:fullscreen {
          padding: 20px;
          background: #f5f5f5;
        }

        .org-chart-wrapper:fullscreen .org-chart-container {
          height: calc(100vh - 100px);
        }
      `}</style>
    </div>
  );
}
