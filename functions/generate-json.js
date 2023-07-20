export default function init() {
  addEventListener("fetch", async (event) => {
    const data = {
      message: "Salutations from Edgio Functions!",
      description: "This is a sample JSON response.",
      awesome: true,
      powerLevel: 9001,
    };

    const content = JSON.stringify(data);

    const response = new Response(content, {
      headers: { "content-type": "application/json; charset=utf-8", 'x-edge-power': '9001' },
    });

    event.respondWith(response);
  });
}
