import fs from "fs";
import cheerio from "cheerio";
import axios from "axios";

const url = "";

let page;
try {
  page = fs.readFileSync("page.html", "utf8");
} catch (e) {
  page = await axios(url).then((res) => res.data);
  fs.writeFileSync("page.html", page, {});
}

const $ = cheerio.load(page);

const rows = $("#content .container")
  .map((i, row) => {
    const title = $(row).find("h4").text();

    const verseRow = $(row).find("div.row.text.verse-group");

    const verses = verseRow
      .map((__, verseRow) => {
        return $(verseRow)
          .find(".span3")
          .map((___, span) => {
            const verse = $(span).find("strong").text();

            const sups = $(span)
              .find("sup")
              .map((____, sup) => {
                return parseInt($(sup).text(), 10);
              })
              .get();

            const supText = sups.length
              ? `:${sups[0]}-${sups[sups.length - 1]}`
              : "";

            return `${verse}${supText}`.trim();
          })
          .get();
      })
      .get();

    return { title, verses };
  })
  .get();

fs.writeFileSync("data.json", JSON.stringify(rows), {});
