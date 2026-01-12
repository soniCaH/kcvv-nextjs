import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UnifiedSearchBar } from "./UnifiedSearchBar";
import type { OrgChartNode } from "@/types/organogram";
import type { ResponsibilityPath } from "@/types/responsibility";

describe("UnifiedSearchBar", () => {
  const mockMembers: OrgChartNode[] = [
    {
      id: "president",
      name: "John Doe",
      title: "Voorzitter",
      positionShort: "PRES",
      email: "john@example.com",
      department: "hoofdbestuur",
    },
    {
      id: "secretary",
      name: "Jane Smith",
      title: "Secretaris",
      email: "jane@example.com",
      department: "hoofdbestuur",
    },
    {
      id: "jeugdcoordinator",
      name: "Maria Janssens",
      title: "Jeugdcoördinator",
      department: "jeugdbestuur",
    },
  ];

  const mockResponsibilityPaths: ResponsibilityPath[] = [
    {
      id: "inschrijving-nieuw-lid",
      role: ["niet-lid", "ouder"],
      question: "wil mij graag inschrijven",
      keywords: ["inschrijven", "lid worden"],
      summary: "Gebruik het online inschrijvingsformulier",
      category: "administratief",
      primaryContact: {
        role: "Jeugdsecretaris",
        email: "jeugd@example.com",
        memberId: "jeugdcoordinator",
      },
      steps: [],
    },
    {
      id: "club-sponsoren",
      role: ["niet-lid"],
      question: "wil de club graag sponsoren",
      keywords: ["sponsor", "sponsoring"],
      summary: "Neem contact op met de sponsoringverantwoordelijke",
      category: "commercieel",
      primaryContact: {
        role: "Verantwoordelijke Sponsoring",
        email: "sponsoring@example.com",
        memberId: "treasurer",
      },
      steps: [],
    },
  ];

  it("renders search input", () => {
    render(
      <UnifiedSearchBar
        value=""
        onChange={vi.fn()}
        members={mockMembers}
        responsibilityPaths={mockResponsibilityPaths}
      />,
    );

    const input = screen.getByRole("textbox", { name: /zoeken/i });
    expect(input).toBeInTheDocument();
  });

  it("displays placeholder text", () => {
    render(
      <UnifiedSearchBar
        value=""
        onChange={vi.fn()}
        members={mockMembers}
        responsibilityPaths={mockResponsibilityPaths}
        placeholder="Custom placeholder"
      />,
    );

    expect(
      screen.getByPlaceholderText("Custom placeholder"),
    ).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const handleChange = vi.fn();
    render(
      <UnifiedSearchBar
        value=""
        onChange={handleChange}
        members={mockMembers}
        responsibilityPaths={mockResponsibilityPaths}
      />,
    );

    const input = screen.getByRole("textbox", { name: /zoeken/i });
    fireEvent.change(input, { target: { value: "john" } });

    expect(handleChange).toHaveBeenCalledWith("john");
  });

  it("shows clear button when value is not empty", () => {
    const { rerender } = render(
      <UnifiedSearchBar
        value=""
        onChange={vi.fn()}
        members={mockMembers}
        responsibilityPaths={mockResponsibilityPaths}
      />,
    );

    expect(
      screen.queryByRole("button", { name: /wissen/i }),
    ).not.toBeInTheDocument();

    rerender(
      <UnifiedSearchBar
        value="john"
        onChange={vi.fn()}
        members={mockMembers}
        responsibilityPaths={mockResponsibilityPaths}
      />,
    );

    expect(screen.getByRole("button", { name: /wissen/i })).toBeInTheDocument();
  });

  it("clears search when clear button is clicked", () => {
    const handleChange = vi.fn();
    render(
      <UnifiedSearchBar
        value="john"
        onChange={handleChange}
        members={mockMembers}
        responsibilityPaths={mockResponsibilityPaths}
      />,
    );

    const clearButton = screen.getByRole("button", { name: /wissen/i });
    fireEvent.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith("");
  });

  it("shows member results when searching", () => {
    const { rerender } = render(
      <UnifiedSearchBar
        value=""
        onChange={vi.fn()}
        members={mockMembers}
        responsibilityPaths={mockResponsibilityPaths}
        showAutocomplete={true}
      />,
    );

    const input = screen.getByRole("textbox", { name: /zoeken/i });
    fireEvent.focus(input);

    // Initially no results
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();

    // Update value to trigger search
    rerender(
      <UnifiedSearchBar
        value="john"
        onChange={vi.fn()}
        members={mockMembers}
        responsibilityPaths={mockResponsibilityPaths}
        showAutocomplete={true}
      />,
    );

    // Wait for results to appear
    const memberName = screen.getByText("John Doe");
    expect(memberName).toBeInTheDocument();
  });

  it("shows responsibility results when searching", () => {
    const { rerender } = render(
      <UnifiedSearchBar
        value=""
        onChange={vi.fn()}
        members={mockMembers}
        responsibilityPaths={mockResponsibilityPaths}
        showAutocomplete={true}
      />,
    );

    const input = screen.getByRole("textbox", { name: /zoeken/i });
    fireEvent.focus(input);

    // Update value to trigger search
    rerender(
      <UnifiedSearchBar
        value="inschrijven"
        onChange={vi.fn()}
        members={mockMembers}
        responsibilityPaths={mockResponsibilityPaths}
        showAutocomplete={true}
      />,
    );

    // Check for responsibility result
    const question = screen.getByText("wil mij graag inschrijven");
    expect(question).toBeInTheDocument();
  });

  it("calls onSelectMember when member is clicked", () => {
    const handleSelectMember = vi.fn();
    const { rerender } = render(
      <UnifiedSearchBar
        value=""
        onChange={vi.fn()}
        members={mockMembers}
        responsibilityPaths={mockResponsibilityPaths}
        onSelectMember={handleSelectMember}
        showAutocomplete={true}
      />,
    );

    const input = screen.getByRole("textbox", { name: /zoeken/i });
    fireEvent.focus(input);

    rerender(
      <UnifiedSearchBar
        value="john"
        onChange={vi.fn()}
        members={mockMembers}
        responsibilityPaths={mockResponsibilityPaths}
        onSelectMember={handleSelectMember}
        showAutocomplete={true}
      />,
    );

    const memberButton = screen.getByText("John Doe").closest("button");
    if (memberButton) {
      fireEvent.click(memberButton);
      expect(handleSelectMember).toHaveBeenCalledWith(mockMembers[0]);
    }
  });

  it("calls onSelectResponsibility when responsibility is clicked", () => {
    const handleSelectResponsibility = vi.fn();
    const { rerender } = render(
      <UnifiedSearchBar
        value=""
        onChange={vi.fn()}
        members={mockMembers}
        responsibilityPaths={mockResponsibilityPaths}
        onSelectResponsibility={handleSelectResponsibility}
        showAutocomplete={true}
      />,
    );

    const input = screen.getByRole("textbox", { name: /zoeken/i });
    fireEvent.focus(input);

    rerender(
      <UnifiedSearchBar
        value="inschrijven"
        onChange={vi.fn()}
        members={mockMembers}
        responsibilityPaths={mockResponsibilityPaths}
        onSelectResponsibility={handleSelectResponsibility}
        showAutocomplete={true}
      />,
    );

    const responsibilityButton = screen
      .getByText("wil mij graag inschrijven")
      .closest("button");
    if (responsibilityButton) {
      fireEvent.click(responsibilityButton);
      expect(handleSelectResponsibility).toHaveBeenCalledWith(
        mockResponsibilityPaths[0],
      );
    }
  });

  it("shows no results message when no matches found", () => {
    const { rerender } = render(
      <UnifiedSearchBar
        value=""
        onChange={vi.fn()}
        members={mockMembers}
        responsibilityPaths={mockResponsibilityPaths}
        showAutocomplete={true}
      />,
    );

    const input = screen.getByRole("textbox", { name: /zoeken/i });
    fireEvent.focus(input);

    rerender(
      <UnifiedSearchBar
        value="xyz123nonexistent"
        onChange={vi.fn()}
        members={mockMembers}
        responsibilityPaths={mockResponsibilityPaths}
        showAutocomplete={true}
      />,
    );

    expect(screen.getByText(/geen resultaten gevonden/i)).toBeInTheDocument();
  });

  it("does not show autocomplete when showAutocomplete is false", () => {
    const { rerender } = render(
      <UnifiedSearchBar
        value=""
        onChange={vi.fn()}
        members={mockMembers}
        responsibilityPaths={mockResponsibilityPaths}
        showAutocomplete={false}
      />,
    );

    const input = screen.getByRole("textbox", { name: /zoeken/i });
    fireEvent.focus(input);

    rerender(
      <UnifiedSearchBar
        value="john"
        onChange={vi.fn()}
        members={mockMembers}
        responsibilityPaths={mockResponsibilityPaths}
        showAutocomplete={false}
      />,
    );

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });
});
