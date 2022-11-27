import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTurnDown, faArrowTurnUp } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState(true);
  const [count, setCount] = useState(3);

  const generate = useCallback(
    (input: string): string => {
      let array = input.replace(/\s+/g, " ").trim().split(" ");
      let newArray = array.map((word, i) => {
        const articles = ["a", "an", "the", "A", "An", "The"];
        if (articles.includes(word)) {
          return mode ? "_".repeat(count) + " " : "";
        } else if (i !== 0 && articles.includes(array[i - 1]) && array[i - 1][0] === array[i - 1][0].toUpperCase()) {
          return mode ? word + " " : word[0].toUpperCase() + word.slice(1) + " ";
        } else {
          return word + " ";
        }
      });
      let temp = "";
      newArray.forEach((word) => (temp += word));
      return temp.trimEnd();
    },
    [count, mode]
  );

  useEffect(() => {
    setOutput(generate(input));
  }, [input, mode, count, generate]);

  return (
    <>
      <Head>
        <title>Odstranění členů</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-4 lg:px-8 flex flex-col gap-4 pt-8">
        <section>
          <div className="mb-4">
            <h1 className="text-lg font-semibold mb-2 text-gray-800">Odstranění členů z textu</h1>
            <div className="text-sm text-gray-600">
              Tlačítko <i>vložit</i> vloží obsah schránky do levého pole. Po jakékoliv změně levého pole se pravé pole automaticky vygeneruje podle aktuálního nastavení. Stane se tak i při jakékoliv změně nastavení. Tlačítko <i>zkopírovat</i> do schránky uloží obsah pravého pole. Tlačítko{" "}
              <i>automaticky</i> provede obě akce najednou, stačí tedy mít ve schránce uložení text, který je potřeba upravit, a kliknutím na toto tlačítko se schránka přepíše na upravený text.{" "}
              <button
                className="underline select-none"
                onClick={() =>
                  setInput(
                    "If you're looking for random paragraphs, you've come to the right place. When a random word or a random sentence isn't quite enough, the next logical step is to find a random paragraph. We created the Random Paragraph Generator with you in mind. The process is quite simple. Choose the number of random paragraphs you'd like to see and click the button. Your chosen number of paragraphs will instantly appear."
                  )
                }
              >
                Vložit testovací odstavec
              </button>
            </div>
          </div>
          <div className="mb-2">
            <label htmlFor="language" className="text-sm font-medium text-gray-900 select-none">
              Jazyk textu:{" "}
            </label>
            <select name="language" id="language" className="text-sm outline-none border-2 rounded-lg p-1 border-transparent focus:border-indigo-500">
              <option value="en">Angličtina</option>
            </select>
          </div>
          <div className="flex items-center mb-3">
            <input checked={mode} onChange={(e) => setMode(e.target.checked)} id="underscores" type="radio" name="mode" className="accent-indigo-500 outline-none" />
            <label htmlFor="underscores" className="ml-2 text-sm font-medium text-gray-900 select-none">
              Nahradit podtržítky {mode && `(${count})`}
            </label>
            {mode && <input type="range" name="count" id="count" value={count} onChange={(e) => setCount(+e.target.value)} min={1} max={8} step={1} className="outline-none accent-indigo-500 ml-1" />}
          </div>
          <div className="flex items-center mb-3">
            <input checked={!mode} onChange={(e) => setMode(!e.target.checked)} id="nothing" type="radio" name="mode" className="accent-indigo-500 outline-none" />
            <label htmlFor="nothing" className="ml-2 text-sm font-medium text-gray-900 select-none">
              Odstranit úplně
            </label>
          </div>
        </section>
        <section className="grid lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-3 w-full">
            <section className="flex flex-wrap gap-2">
              <button className="btn btn-primary" onClick={async () => setInput(await navigator.clipboard.readText())}>
                Vložit ze schránky <FontAwesomeIcon icon={faArrowTurnDown} />
              </button>
              <button className="btn btn-secondary" onClick={() => setInput("")}>
                Vymazat pole
              </button>
            </section>
            <textarea placeholder="Zdroj" name="input" id="input" rows={20} value={input} onChange={(e) => setInput(e.target.value)}></textarea>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <section className="flex flex-wrap gap-2">
              <button className="btn btn-primary" onClick={() => navigator.clipboard.writeText(output)}>
                Zkopírovat do schránky <FontAwesomeIcon icon={faArrowTurnUp} />
              </button>
            </section>
            <textarea placeholder="Výsledek" name="output" id="output" rows={20} value={output} readOnly></textarea>
          </div>
        </section>
      </main>
      <footer className="flex justify-center gap-1 text-gray-400 my-8">
        Vytvořil
        <Link href="https://hynekfisera.com/" className="link">
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
