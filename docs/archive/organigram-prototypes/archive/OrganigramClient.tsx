"use client";

/**
 * Organigram Client Component
 *
 * Interactive organizational chart with state management and interactivity.
 * Separated from page.tsx to allow for server-side metadata.
 */

import { useState, useRef, useEffect } from "react";
import { OrgChart, MemberDetailsModal } from "@/components/organigram";
import { clubStructure } from "@/data/club-structure";
import type { OrgChartNode, OrgChartConfig } from "@/types/organigram";

/**
 * Render an interactive organizational chart with department filtering, helper info cards, and a member details modal.
 *
 * The component provides controls to filter the chart by department, displays informational cards about interactions and controls, renders the OrgChart with zoom/expand capabilities, and exposes a modal to view contact and role details for the selected member.
 *
 * @returns The rendered React nodes for the organigram UI
 */
export function OrganigramClient() {
  const [selectedMember, setSelectedMember] = useState<OrgChartNode | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<
    "all" | "hoofdbestuur" | "jeugdbestuur"
  >("all");

  // Filter data based on selected department
  const filteredData =
    departmentFilter === "all"
      ? clubStructure
      : clubStructure.filter(
          (node) =>
            node.department === departmentFilter ||
            node.department === "general" ||
            node.id === "club" ||
            node.id === "president",
        );

  const chartConfig: OrgChartConfig = {
    initialZoom: 0.7,
    expandToDepth: 3, // Show more levels initially for better overview
    departmentFilter: departmentFilter,
  };

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleNodeClick = (node: OrgChartNode) => {
    setSelectedMember(node);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setSelectedMember(null), 300);
  };

  return (
    <>
      {/* Department Filter */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <span className="font-semibold text-gray-blue">Filter afdeling:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDepartmentFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                departmentFilter === "all"
                  ? "bg-green-main text-white shadow-md"
                  : "bg-gray-100 text-gray-dark hover:bg-gray-200"
              }`}
            >
              Volledige club
            </button>
            <button
              onClick={() => setDepartmentFilter("hoofdbestuur")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                departmentFilter === "hoofdbestuur"
                  ? "bg-green-main text-white shadow-md"
                  : "bg-gray-100 text-gray-dark hover:bg-gray-200"
              }`}
            >
              Hoofdbestuur
            </button>
            <button
              onClick={() => setDepartmentFilter("jeugdbestuur")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                departmentFilter === "jeugdbestuur"
                  ? "bg-green-main text-white shadow-md"
                  : "bg-gray-100 text-gray-dark hover:bg-gray-200"
              }`}
            >
              Jeugdbestuur
            </button>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-green-main">
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="w-6 h-6 text-green-main"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
            <h3 className="font-bold text-gray-blue">
              Klik om uit/in te klappen
            </h3>
          </div>
          <p className="text-sm text-gray-dark">
            Klik op een kaartje om de onderliggende functies te zien of te
            verbergen. Hele kaart is klikbaar!
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-green-main">
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="w-6 h-6 text-green-main"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="font-bold text-gray-blue">Zoek & bekijk details</h3>
          </div>
          <p className="text-sm text-gray-dark">
            Zoek een persoon en klik op de kaart voor contactgegevens en taken.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-green-main">
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="w-6 h-6 text-green-main"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-2-2m0 0l-2.5-2.5M19 19l-2.5-2.5m0 0L11 11m5 5l-2.5-2.5M11 11l-2-2m2 2l-2.5-2.5M11 11V7.5M11 11H7.5"
              />
            </svg>
            <h3 className="font-bold text-gray-blue">Gebruik de knoppen</h3>
          </div>
          <p className="text-sm text-gray-dark">
            Gebruik de + en − knoppen om in/uit te zoomen. Sleep met de muis om
            te pannen.
          </p>
        </div>
      </div>

      {/* Organizational Chart */}
      <OrgChart
        data={filteredData}
        config={chartConfig}
        onNodeClick={handleNodeClick}
        className="mb-8"
      />

      {/* Additional Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2
          className="text-xl font-bold text-gray-blue mb-4"
          style={{
            fontFamily: "quasimoda, acumin-pro, Montserrat, sans-serif",
          }}
        >
          Over onze organisatie
        </h2>
        <div className="space-y-3 text-gray-dark">
          <p>
            KCVV Elewijt heeft een uitgebreide organisatiestructuur met zowel
            een <strong>Hoofdbestuur</strong> voor de algemene clubwerking als
            een <strong>Jeugdbestuur</strong> dat zich specifiek focust op de
            ontwikkeling van onze jeugdspelers.
          </p>
          <p>
            Ons bestuur werkt nauw samen met vrijwilligers, trainers, en ouders
            om een professionele en gezellige voetbalomgeving te creëren voor
            spelers van alle leeftijden.
          </p>
          <p className="text-sm text-gray-medium pt-2 border-t border-gray-light">
            <strong>Wil je contact opnemen?</strong> Klik op een bestuurslid in
            het organigram om de contactgegevens te bekijken, of stuur een
            e-mail naar{" "}
            <a
              href="mailto:info@kcvvelewijt.be"
              className="text-green-main hover:text-green-hover hover:underline"
            >
              info@kcvvelewijt.be
            </a>
            .
          </p>
        </div>
      </div>

      {/* Member Details Modal */}
      <MemberDetailsModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
