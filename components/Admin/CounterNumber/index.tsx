type Props = {
  number: number;
};

const CounterNumber = (props: Props) => {
  if (props.number === 0) return null;

  return (
    <div
      style={{
        backgroundColor: "red",
        borderRadius: "10px",
        padding: "2px 4px",
        color: "white",
        fontSize: "10px",
        minWidth: 16,
        height: 16,
        marginLeft: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {props.number}
    </div>
  );
};

export default CounterNumber;
