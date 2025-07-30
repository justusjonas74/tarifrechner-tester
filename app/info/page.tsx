export default function InfoPage() {
  return <div className="container">
    <div className="row">
      <h1 className="my-4">Info</h1>
      <p>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Merkmal</th>
              <th scope="col">Wert</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Angefragter Tarifrechner:
              </td>
              <td>
                <pre>
                  {process.env.NEXT_PUBLIC_URL}
                </pre>
              </td>
            </tr>
          </tbody>
        </table>
      </p>
    </div>
  </div>
}
