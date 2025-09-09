const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  try {
    const owner = "shivangperplexity";
    const repo = "schedule";
    const path = "events";

    // Optional: Personal Access Token for private repos
    const token = process.env.GITHUB_TOKEN;

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: token ? { Authorization: `token ${token}` } : {}
    });

    if (!res.ok) return { statusCode: res.status, body: "Failed to fetch events" };

    const files = await res.json();
    const events = [];

    for (const file of files) {
      if (file.name.endsWith(".md")) {
        const mdRes = await fetch(file.download_url, {
          headers: token ? { Authorization: `token ${token}` } : {}
        });
        const text = await mdRes.text();

        const match = /^---([\s\S]*?)---([\s\S]*)$/m.exec(text);
        if (!match) continue;

        const frontmatter = match[1];
        const body = match[2].trim();

        const data = {};
        frontmatter.split("\n").forEach(line => {
          const [key, ...rest] = line.split(":");
          if (key) data[key.trim()] = rest.join(":").trim().replace(/^"|"$/g, "");
        });

        events.push({
          title: data.title || "कार्यक्रम",
          date: data.date || "",
          place: data.place || "",
          map_url: data.map_url || "",
          description: body
        });
      }
    }

    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(events)
    };

  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
