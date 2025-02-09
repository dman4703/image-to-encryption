"use client";

import React, { useState, useEffect } from "react";

interface SaltInputProps {
    onSaltChange: (salt: string) => void;
}

const questions = [
    "Add your age to your zip code:",
    "Add the number of siblings you have to the number of letters in your name:",
    "Add your birth month from your current age:",
    "Multiply the number of letters in your last name by 2:",
    "Add the day of the month you were born to the current day of the month:",
    "Input the number of letters in the current day of the week:",
    "Input the number of letters in the name of your favorite animal:",
    "Add the number of letters in the name of your favorite movie to your birth year:",
    "Input the number of hours you slept last night:",
    "Add the amount of times you left the country to your age:",
    "Input your shoe size:",
    "Input the number of sports you play:",
    "Input the last 4 digits of your phone number:",
    "Input the number of relatives you have:",
    "Input your favorite numberL",
    "Add the number of times you've traveled this year to your age:",
    "Add your ZIP code to your current age:",
    "Input the number of hours of screen time you get per day:",
    "Input the number of times you have moved to a new house",
];

export default function SaltInput({ onSaltChange }: SaltInputProps) {
    const [inputValue, setInputValue] = useState("");
    const [question, setQuestion] = useState("");

    useEffect(() => {
        // Randomly select one question from the bank.
        const randomIndex = Math.floor(Math.random() * questions.length);
        setQuestion(questions[randomIndex]);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        onSaltChange(value);
    };

    return (
        <div className="flex flex-col items-center">
            <label className="mb-2 font-medium text-center">{question}</label>
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Enter your answer"
                className="border p-2 rounded w-64"
            />
        </div>
    );
}
