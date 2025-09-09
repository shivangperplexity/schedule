const fs = require("fs");
const path = require("path");

exports.handler = async function(event, context) {
  try {
    const eventsDir = path.join(__dirname, "../events"); // .md files folder
    const outputFile = path.join(__dirname, "../public/events.json");

    const files = fs.readdirSync(eventsDir).filter(f => f.endsWith(".md"));
    const events = [];

    for (const file of files) {
      const content = fs.readFileSync(path.join(eventsDir, file), "utf8");
      const match = /^---([\s\S]*?)---([\s\S]*)$/m.exec(content);
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

    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    fs.writeFileSync(outputFile, JSON.stringify(events, null, 2), "utf8");

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "events.json generated", count: events.length })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.message };
  }
};
