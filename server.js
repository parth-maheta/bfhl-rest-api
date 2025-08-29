import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const FULL_NAME = process.env.FULL_NAME || "default_user";
const DOB = process.env.DOB || "01012000";
const EMAIL = process.env.EMAIL || "example@mail.com";
const ROLL_NUMBER = process.env.ROLL_NUMBER || "ROLL123";
const PORT = process.env.PORT || 3000;

const USER_ID = `${FULL_NAME.toLowerCase()}_${DOB}`;

function alternatingCapsConcat(strArr) {
  const concatenated = strArr.join(""); // concatenate all
  const reversed = concatenated.split("").reverse().join(""); // reverse
  let result = "";
  for (let i = 0; i < reversed.length; i++) {
    result +=
      i % 2 === 0 ? reversed[i].toUpperCase() : reversed[i].toLowerCase();
  }
  return result;
}

app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        user_id: USER_ID,
        email: EMAIL,
        roll_number: ROLL_NUMBER,
        message: "Invalid input. 'data' must be an array.",
      });
    }

    let odd_numbers = [];
    let even_numbers = [];
    let alphabets = [];
    let special_characters = [];
    let sum = 0;

    data.forEach((item) => {
      if (/^-?\d+$/.test(item)) {
        const num = parseInt(item, 10);
        sum += num;
        if (num % 2 === 0) {
          even_numbers.push(item);
        } else {
          odd_numbers.push(item);
        }
      } else if (/^[a-zA-Z]+$/.test(item)) {
        alphabets.push(item.toUpperCase());
      } else {
        special_characters.push(item);
      }
    });

    const concat_string = alternatingCapsConcat(alphabets);

    return res.json({
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: sum.toString(),
      concat_string,
    });
  } catch (err) {
    return res.status(500).json({
      is_success: false,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      message: "Server error",
      error: err.message,
    });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
