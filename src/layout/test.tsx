import { useEffect } from "react";
import Header from "../components/molecules/HeaderSection";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

export default function TestLayout() {
  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(doc(db, "forms", "SsC2WTl3zeAkesMj2bbt8"));
      const data = docSnap.data();

      console.log(data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Header />
      <p className="">Hello</p>
    </div>
  );
}
