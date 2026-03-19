import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders ShopSmart title", async () => {
  render(<App />);
  const heading = await screen.findByRole("heading", { name: /shop/i });
  expect(heading).toBeInTheDocument();
});

test("renders Explore section", () => {
  render(<App />);
  expect(screen.getByText(/Explore/i)).toBeInTheDocument();
});

test("renders Cart button", () => {
  render(<App />);
  expect(screen.getByText(/Cart/i)).toBeInTheDocument();
});