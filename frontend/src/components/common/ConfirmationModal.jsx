import IconBtn from "./IconBtn";

export default function ConfirmationModal({ modalData }) {
  return (
    <div>
      <div>
        <p>{modalData?.text1}</p>
        <p>{modalData?.text2}</p>
        <div>
          <IconBtn
            onClick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
          />
          <button className="" onClick={modalData?.btn2Handler}>
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
}
