import { useEffect, useState } from "react";

const KeySetup = () => {
  const [valid, setValid] = useState(false);
  const [key, setKey] = useState();

  useEffect(() => {
    async function generateAes256Key() {
      const key = await window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256, // 256 bits
        },
        true, // extractable
        ["encrypt", "decrypt"] // usage
      );

      // Convert the key to a hex string for easier storage/transmission
      const keyData = await window.crypto.subtle.exportKey("raw", key);
      const hexKey = Array.from(new Uint8Array(keyData))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      localStorage.setItem("key", hexKey);
      setKey(hexKey);
    }

    if (
      sessionStorage.getItem("needsKey") &&
      localStorage.getItem("key") == null
    ) {
      generateAes256Key();
      setValid(true);
    } else {
      setValid(false);
    }
  }, []);

  if (!valid) return <div>You aren't supposed to be here</div>;
  else
    return (
      <div>
        <h1>
          This is your private key. You MUST save this key. Please print this
          page and retain a physical copy. Without this key, your passwords will
          be irrecoverable.
        </h1>
        <h3>{key}</h3>

        <button>Proceed to login</button>
      </div>
    );
};

export default KeySetup;
