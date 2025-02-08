"use client";

import React, { useState, useEffect } from "react";

interface SaltInputProps {
    onSaltChange: (salt: string) => void;
}

const questions = [
    "Multiply your age by the number of letters in your favorite animal's name:",
    "Add the number of siblings you have to the number of vowels in your first name:",
    "Subtract your birth month from your current age:",
    "Multiply the number of letters in your last name by 2:",
    "Add the day of the month you were born to the number of letters in your favorite color:",
    "Multiply the number of pets you've owned by the number of vowels in your last name:",
    "Add the number of letters in your middle name to the number of consonants in your first name:",
    "Subtract the number of letters in your favorite movie title from your birth year:",
    "Multiply the number of hours you usually sleep by the number of vowels in your favorite fruit:",
    "Add the number of countries you've visited to the number of letters in your hometown:",
    "Subtract the number of books you've read this year from your shoe size:",
    "Multiply the number of sports you play by the number of vowels in your favorite actor's name:",
    "Add the number of letters in your favorite food to the last digit of your phone number:",
    "Subtract the number of letters in your mother's first name from your father's first name:",
    "Multiply the number of keys on your keyboard by the number of monitors you use:",
    "Add the number of times you've traveled this year to the number of letters in your birth month:",
    "Subtract the number of digits in your ZIP code from your current age:",
    "Multiply the number of letters in your favorite band's name by the number of pets you've had:",
    "Add the number of vowels in your favorite car's brand to the number of houses you've lived in:",
    "Subtract the number of hours you spend online daily from the number of letters in your favorite video game:",
    "Multiply the number of cousins you have by the number of fingers on one hand:",
    "Add the number of letters in your street name to the number of siblings your parents have:",
    "Subtract the number of letters in your best friend's first name from the number of letters in your own:",
    "Multiply the number of letters in your dream travel destination by the number of times you've been on a plane:",
    "Add the number of letters in your first teacher's name to the number of vowels in your birth city:"
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
