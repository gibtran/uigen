import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge, getToolLabel } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// --- getToolLabel unit tests ---

test("getToolLabel: str_replace_editor create", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "/App.tsx" })).toBe("Creating /App.tsx");
});

test("getToolLabel: str_replace_editor str_replace", () => {
  expect(getToolLabel("str_replace_editor", { command: "str_replace", path: "/App.tsx" })).toBe("Editing /App.tsx");
});

test("getToolLabel: str_replace_editor insert", () => {
  expect(getToolLabel("str_replace_editor", { command: "insert", path: "/App.tsx" })).toBe("Editing /App.tsx");
});

test("getToolLabel: str_replace_editor view", () => {
  expect(getToolLabel("str_replace_editor", { command: "view", path: "/App.tsx" })).toBe("Viewing /App.tsx");
});

test("getToolLabel: str_replace_editor undo_edit", () => {
  expect(getToolLabel("str_replace_editor", { command: "undo_edit", path: "/App.tsx" })).toBe("Undoing edit on /App.tsx");
});

test("getToolLabel: file_manager rename", () => {
  expect(getToolLabel("file_manager", { command: "rename", path: "/old.tsx" })).toBe("Renaming /old.tsx");
});

test("getToolLabel: file_manager delete", () => {
  expect(getToolLabel("file_manager", { command: "delete", path: "/old.tsx" })).toBe("Deleting /old.tsx");
});

test("getToolLabel: unknown tool falls back to toolName", () => {
  expect(getToolLabel("some_unknown_tool", { command: "foo", path: "/x.ts" })).toBe("some_unknown_tool");
});

test("getToolLabel: empty args falls back to toolName", () => {
  expect(getToolLabel("str_replace_editor", {})).toBe("str_replace_editor");
});

// --- ToolCallBadge render tests ---

test("ToolCallBadge shows label from args", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Creating /App.tsx")).toBeDefined();
});

test("ToolCallBadge shows spinner when in progress", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.tsx" }}
      state="call"
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("ToolCallBadge shows green dot when done", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.tsx" }}
      state="result"
      result="OK"
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("ToolCallBadge shows spinner when state is result but result is null", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.tsx" }}
      state="result"
      result={null}
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("ToolCallBadge renders file_manager delete label", () => {
  render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "delete", path: "/utils.ts" }}
      state="call"
    />
  );
  expect(screen.getByText("Deleting /utils.ts")).toBeDefined();
});
