import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders ShopSmart title", async () => {
  render(<App />);

  const heading = await screen.findByRole("heading", {
    name: /shop/i,
  });

  expect(heading).toBeInTheDocument();
});