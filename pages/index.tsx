import React, { useState, useEffect, useCallback, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTurnDown, faArrowTurnUp } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState(true);
  const [count, setCount] = useState(3);
  const [copy, setCopy] = useState(false);

  const symbols: string[] = useMemo(() => ["'", '"', "”", "(", "[", "{", "“", "«", "„", "《", "`", "´", "‘", "’"], []);

  const articles: string[] = useMemo(() => {
    const lowercaseBaseArticles: string[] = ["a", "an", "the"];
    const uppercaseBaseArticles: string[] = lowercaseBaseArticles.map((lowercaseArticle) => lowercaseArticle[0].toUpperCase() + lowercaseArticle.slice(1));
    const baseArticles: string[] = [...lowercaseBaseArticles, ...uppercaseBaseArticles];
    let result: string[] = [...baseArticles];
    symbols.forEach((symbol) => {
      baseArticles.forEach((baseArticle) => result.push(symbol + baseArticle));
    });
    return result;
  }, [symbols]);

  const _generate = useCallback(
    (input: string) => {
      let array = input
        .replace(/[ \t]+/g, " ")
        .trim()
        .split(" ");
      let newArray = array.map((word, i) => {
        if (articles.includes(word)) {
          if (symbols.includes(word[0])) {
            return mode ? word[0] + "_".repeat(count) + " " : word[0];
          } else {
            return mode ? "_".repeat(count) + " " : "";
          }
        } else if (i !== 0 && articles.includes(array[i - 1]) && (array[i - 1].startsWith("'") || array[i - 1].startsWith('"') ? array[i - 1][1] === array[i - 1][1].toUpperCase() : array[i - 1][0] === array[i - 1][0].toUpperCase())) {
          return mode ? word + " " : word[0].toUpperCase() + word.slice(1) + " ";
        } else {
          return word + " ";
        }
      });
      let temp = "";
      newArray.forEach((word) => (temp += word));
      return temp.trimEnd();
    },
    [count, mode, articles, symbols]
  );

  const generate = useCallback(
    (input: string): string => {
      let temp = "";
      const inputArray = input.split(/\r?\n/);
      inputArray.forEach((paragraph, i) => {
        temp += _generate(paragraph) + (i !== inputArray.length - 1 ? "\n" : "");
      });
      return temp;
    },
    [_generate]
  );

  useEffect(() => {
    setOutput(generate(input));
  }, [input, mode, count, generate]);

  const onCopy = () => {
    navigator.clipboard.writeText(output);
    setCopy(true);
    setTimeout(() => setCopy(false), 800);
  };

  return (
    <>
      <Head>
        <title>Pomůcka pro výuku jazyků - odstranění členů z textu</title>
        <meta name="description" content="Aplikace pro učitele jazyků, která umožňuje jednoduše vytvářet cvičení na procičování členů." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-4 lg:px-8 flex flex-col gap-4 pt-8">
        <section>
          <div className="mb-4">
            <h1 className="text-lg font-semibold mb-4 text-gray-800">Pomůcka pro výuku jazyků - odstranění členů z textu</h1>
            <div className="text-sm text-gray-600">
              Tlačítko <i>Vložit ze schránky</i> vloží obsah schránky do levého pole. Text je možné psát i ručně přímo do pole. Po jakékoliv změně levého pole se do pravého pole automaticky vygeneruje text podle aktuálního nastavení. Stane se tak i při jakékoliv změně nastavení. Tlačítko{" "}
              <i>Zkopírovat do schránky</i> uloží obsah pravého pole do schránky.
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="language" className="text-sm font-medium text-gray-900 select-none mr-1">
              Jazyk textu:{" "}
            </label>
            <select name="language" id="language" className="text-sm outline-none border-2 bg-gray-100 rounded-xl p-1.5 border-transparent focus:border-indigo-500">
              <option value="en">Angličtina</option>
              <option value="de" disabled>
                Němčina (v přípravě)
              </option>
            </select>
          </div>
          <div className={`flex flex-col gap-2 mb-3 hover:bg-gray-50 border-2 py-3 px-5 rounded-xl cursor-pointer ${mode ? "border-indigo-400" : "border-gray-300"}`} onClick={() => setMode(true)}>
            <div>
              <input checked={mode} onChange={(e) => setMode(e.target.checked)} id="underscores" type="radio" name="mode" className="accent-indigo-500 outline-none" />
              <label htmlFor="underscores" className="ml-2 text-sm font-medium text-gray-900 select-none cursor-pointer">
                Nahradit členy podtržítky {mode && `(${count})`}
              </label>
              {mode && <input type="range" name="count" id="count" value={count} onChange={(e) => setCount(+e.target.value)} min={1} max={8} step={1} className="outline-none accent-indigo-500 ml-1" />}
            </div>
            <div className="text-sm font-normal ml-0.5">
              <span className="font-semibold">Příklad:</span> I wrote <span className="text-green-500">the</span> phrase &quot;<span className="text-orange-500">An</span> apple <span className="text-blue-500">a</span> day keeps <span className="text-purple-500">the</span> doctor away&quot; on{" "}
              <span className="text-red-500">a</span> piece of paper. <span className="font-bold text-normal"> =&gt; </span> I wrote <span className="text-green-500">___</span> phrase &quot;<span className="text-orange-500">___</span> apple <span className="text-blue-500">___</span> day keeps{" "}
              <span className="text-purple-500">___</span> doctor away&quot; on <span className="text-red-500">___</span> piece of paper.
            </div>
          </div>
          <div className={`flex flex-col gap-2 mb-3 hover:bg-gray-50 border-2 py-3 px-5 rounded-xl cursor-pointer ${mode ? "border-gray-300" : "border-indigo-400"}`} onClick={() => setMode(false)}>
            <div>
              <input checked={!mode} onChange={(e) => setMode(!e.target.checked)} id="nothing" type="radio" name="mode" className="accent-indigo-500 outline-none" />
              <label htmlFor="nothing" className="ml-2 text-sm font-medium text-gray-900 select-none cursor-pointer">
                Odstranit členy úplně
              </label>
            </div>
            <div className="text-sm font-normal ml-0.5">
              <span className="font-semibold">Příklad:</span> I wrote <span className="text-green-500">the</span> phrase &quot;<span className="text-orange-500">An</span> apple <span className="text-blue-500">a</span> day keeps <span className="text-purple-500">the</span> doctor away&quot; on{" "}
              <span className="text-red-500">a</span> piece of paper. <span className="font-bold text-normal"> =&gt; </span> I wrote phrase &quot;Apple day keeps doctor away&quot; on piece of paper.
            </div>
          </div>
        </section>
        <section className="grid lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-3 w-full">
            <section className="flex flex-wrap gap-2">
              <button className="btn btn-primary" onClick={async () => setInput(await navigator.clipboard.readText())}>
                Vložit ze schránky <FontAwesomeIcon icon={faArrowTurnDown} />
              </button>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  setInput(
                    "If you're looking for random paragraphs, you've come to the right place. When a random word or a random sentence isn't quite enough, the next logical step is to find a random paragraph. We created the Random Paragraph Generator with you in mind. The process is quite simple. Choose the number of random paragraphs you'd like to see and click the button. Your chosen number of paragraphs will instantly appear."
                  )
                }
              >
                Vložit testovací odstavec <FontAwesomeIcon icon={faArrowTurnDown} />
              </button>
              <button className="btn btn-secondary" onClick={() => setInput("")}>
                Vymazat pole
              </button>
            </section>
            <textarea placeholder="Zdroj" name="input" id="input" rows={20} value={input} onChange={(e) => setInput(e.target.value)}></textarea>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <section className="flex flex-wrap gap-2">
              <button className="btn btn-primary" onClick={onCopy}>
                {copy ? (
                  "Zkopírováno!"
                ) : (
                  <>
                    Zkopírovat do schránky <FontAwesomeIcon icon={faArrowTurnUp} />
                  </>
                )}
              </button>
            </section>
            <textarea placeholder="Výsledek" name="output" id="output" rows={20} value={output} readOnly></textarea>
          </div>
        </section>
      </main>
      <footer className="flex justify-center gap-1 text-gray-400 my-8">
        Vytvořil
        <Link href="https://hynekfisera.cz/" className="link">
          Hynek Fišera
        </Link>{" "}
        |{" "}
        <Link href="https://github.com/hynekfisera/odstraneni-clenu" className="link">
          GitHub
        </Link>
      </footer>
    </>
  );
}
