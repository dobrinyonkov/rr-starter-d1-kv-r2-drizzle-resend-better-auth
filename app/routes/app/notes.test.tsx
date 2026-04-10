import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import NotesPage from "./notes";

const mockNotes = [
  {
    id: "note-1",
    title: "First note",
    content: "Some content here",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "note-2",
    title: "Second note",
    content: "",
    createdAt: new Date("2025-01-16"),
  },
];

describe("Notes page", () => {
  function renderNotes(notes = mockNotes) {
    const Stub = createRoutesStub([
      {
        path: "/app/notes",
        Component: NotesPage,
        loader() {
          return { notes };
        },
        action() {
          return { ok: true };
        },
      },
    ]);
    render(<Stub initialEntries={["/app/notes"]} />);
  }

  it("renders the notes heading", async () => {
    renderNotes();
    expect(await screen.findByText("Notes")).toBeInTheDocument();
  });

  it("shows the demo description", async () => {
    renderNotes();
    expect(
      await screen.findByText(/simple CRUD demo/),
    ).toBeInTheDocument();
  });

  it("renders notes list", async () => {
    renderNotes();
    expect(await screen.findByText("First note")).toBeInTheDocument();
    expect(screen.getByText("Second note")).toBeInTheDocument();
  });

  it("shows note content when present", async () => {
    renderNotes();
    expect(await screen.findByText("Some content here")).toBeInTheDocument();
  });

  it("shows empty state when no notes", async () => {
    renderNotes([]);
    expect(
      await screen.findByText("No notes yet. Create your first one!"),
    ).toBeInTheDocument();
  });

  it("has a new note button", async () => {
    renderNotes();
    expect(await screen.findByText("New note")).toBeInTheDocument();
  });

  it("shows delete buttons for each note", async () => {
    renderNotes();
    await screen.findByText("First note");
    const deleteButtons = screen.getAllByTitle("Delete");
    expect(deleteButtons).toHaveLength(2);
  });

  it("shows create form when new note button is clicked", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    renderNotes();
    await user.click(await screen.findByText("New note"));
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Content")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("hides create form when cancel is clicked", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    renderNotes();
    await user.click(await screen.findByText("New note"));
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    await user.click(screen.getByText("Cancel"));
    expect(screen.queryByLabelText("Title")).not.toBeInTheDocument();
  });
});
