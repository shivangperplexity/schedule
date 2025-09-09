
// functions/get-events.js
const fetch = require("node-fetch");

exports.handler = async () => {
  try {
    const repo = "shivangperplexity/schedule";
    const branch = "main";
    const folder = "events";

    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${folder}?ref=${branch}`);
    const files = await res.json();

    const events = [];

    for (const file of files) {
      if (file.name.endsWith(".md")) {
        const mdRes = await fetch(file.download_url);
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

    // Sort by date
    events.sort((a,b) => new Date(a.date)-new Date(b.date));

    return {
      statusCode: 200,
      body: JSON.stringify(events)
    };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
