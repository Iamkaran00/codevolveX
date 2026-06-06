export default function Tab({ tabData, field, setField }) {
  return (
    <div>
      {tabData.map((tab) => {
        return (
          <button
            key={tab.id}
            onClick={() => setField(tab.type)}
            className={`${field === tab.type ? "tabbut" : "tabbut1"}`}
          >
            {tab?.tabName}
          </button>
        );
      })}
    </div>
  );
}
