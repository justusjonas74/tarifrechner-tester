import CollapseComponent from "./CollapseComponent";

import Image from "next/image";
import { IANTWORTLISTE_DVBMOB_ANGEBOTSINFO_NACH_VERBINDUNG } from "pkm-tarifrechner/build/src/tarifrechner/dvb-mobi/interfaces";
import { useState } from "react";

export default function VdvEinheitslayout(props: {
  daten?: IANTWORTLISTE_DVBMOB_ANGEBOTSINFO_NACH_VERBINDUNG;
}) {
  const { daten } = props;
  const [hasError, setHasError] = useState(false);
  const einheitslayout = daten?.antwortliste?.[0]?.ticketdatenliste?.[0]?.ausgabedaten?.vdveinheitslayout || null;
  if (!einheitslayout) {
    return <div>Keine (Layout-)Daten verfügbar</div>;
  }

  return (
    <CollapseComponent
      chevronText="Einheitslayout"
      id="vdv-einheitslayout-component"
      textClassName="fw-semibold fs-5"
    >
      <div className="container">
        <div className="row my-2">
          {/* <div className="col-4">{einheitslayout.fkvpname}</div> */}
          <div className="col-4">
            {hasError ? (
              <span>{einheitslayout.fkvpname}</span>
            ) : (
              <Image
                alt={einheitslayout.fkvpname + "-Logo"}
                src={"/" + einheitslayout.fkvplogo + ".jpg"}
                height={25}
                width={75}
                onError={(e) => {
                  console.log(e);
                  setHasError(true);
                }}
              />
            )}
          </div>
          <div className="col-8">X.XXX-XXX.XXX</div>
        </div>
        <div className="row my-2">
          <div className="col-4">{einheitslayout.gueltigkeitszeittext}</div>
          <div className="col-8">{einheitslayout.tarifprodukttext}</div>
        </div>
        <div className="row my-2">
          <div className="col-4"></div>
          <div className="col-8">{einheitslayout.gueltigkeitskurztext}</div>
        </div>
        <div className="row my-2">
          <div className="col text-center">
            <Image
              alt="Aztec Barcode"
              width={200}
              height={200}
              src="/575px-Azteccodeexample.svg.png"
            />
          </div>
        </div>
        <div className="row my-2">
          <div
            className="col"
            dangerouslySetInnerHTML={{ __html: einheitslayout.nutzerinfotext }}
          />
        </div>
        <div className="row my-2">
          <div className="col">
            <b>{einheitslayout.tarifprodukttext}</b>
          </div>
        </div>
        <div className="row my-2">
          <div
            className="col"
            dangerouslySetInnerHTML={{
              __html: einheitslayout.gueltigkeitslangtext,
            }}
          />
        </div>
        <div className="row my-2">
          <div
            className="col small text-muted"
            dangerouslySetInnerHTML={{
              __html: einheitslayout.konditionstext,
            }}
          />
        </div>
        <div className="row my-2">
          <div className="col small text-muted">
            Auftrags-Nr: XXXXXXX
            <br />
            {einheitslayout.preistext} <br />
            {/* Ausgestellt am: 18.12.2019 um 13:00 Uhr */}
            Ausgestellt am: xx.xx.xxxx um xx:xx Uhr
          </div>
        </div>
      </div>
    </CollapseComponent>
  );
}
