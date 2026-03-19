import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        status: "ok",
        message: "Integration working",
      }),
  })
);

test("fetches API and logs response", async () => {
  render(<App />);

  await waitFor(() => {
    expect(fetch).toHaveBeenCalled();
  });
});