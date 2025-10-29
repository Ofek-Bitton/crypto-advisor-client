import DashboardCard from "../DashboardCard";

function PriceRow({ symbol, price }) {
  return (
    <tr>
      <td style={{ padding: "4px 6px" }}>{symbol}</td>
      <td style={{ padding: "4px 6px" }}>
        {price !== undefined ? `$${price}` : "—"}
      </td>
    </tr>
  );
}

//  symbol="BTC" price={prices?.bitcoin?.usd} />
//           <PriceRow symbol="ETH" price={prices?.?.usd} />
//           <PriceRow symbol="SOL" price={prices?.solana?.usd} />
//           <PriceRow symbol="DOGE" price={prices?.dogecoin?.usd} />

export default function PricesSection({ prices, onUpvote, onDownvote, voted, prefs }) {
  const coinToPriceMap = {
    'BTC':prices?.bitcoin?.usd,
    'ETH': prices?.ethereum?.usd,
    'SOL': prices?.solana?.usd,
    'DOGE': prices?.dogecoin?.usd,
    }

    console.log(prefs)
  
  return (
    <DashboardCard
      title="Coin Prices 💹"
      onUpvote={onUpvote}
      onDownvote={onDownvote}
      voted={voted}
    >
      <table style={{ fontSize: "13px", width: "100%", color: "#fff" }}>
        <thead style={{ color: "#aaa", fontWeight: "normal" }}>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: "4px 6px",
                borderBottom: "1px solid #444",
              }}
            >
              Asset
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "4px 6px",
                borderBottom: "1px solid #444",
              }}
            >
              USD
            </th>
          </tr>
        </thead>
        <tbody>
          {prefs.map(pref => {
            return <PriceRow symbol={pref} price={coinToPriceMap[pref]} />
          })}
        </tbody>
      </table>
    </DashboardCard>
  );
}
