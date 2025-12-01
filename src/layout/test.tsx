import { exTest } from "@/utils/test";

export default function FormDetail() {
  return (
    <div>
      <button
        onClick={() => {
          exTest();
        }}
        className="border">
        test
      </button>
    </div>
  );
}
