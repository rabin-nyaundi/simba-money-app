import { useRef, useState } from "react";

export default function TransactionForm({ handleTransaction, users, currency }) {

    const amountInputRef = useRef();
    const currencyInputRef = useRef();
    const receiverInputRef = useRef();

    console.log(users);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('submit');

        let transactionData = {
            amount: amountInputRef.current.value,
            currency: currencyInputRef.current.value,
            receiver: receiverInputRef.current.value,
        }

        handleTransaction(transactionData);

    };
    return (
        <>
            <div className="lg:w-1/2 form-group ">
                <form
                    className="w-full bg-white shadow-md rounded px-8 pb-8 mb-4"
                    onSubmit={handleSubmit}
                >
                    <div className="w-full md:w-full px-3 mb-6 md:mb-0 py-4 px-4">
                        <label className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2">
                            Send to
                        </label>
                        <div className="relative">
                            <select
                                ref={receiverInputRef}
                                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            >
                                <option selected>Select Receiver</option>
                                {users.map((user, index) => (

                                    <option key={index} value={user.id}>{ user.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fillCurrent h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-full px-3 mb-6 md:mb-0 py-4 px-4">
                        <label className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2">
                            Currency
                        </label>
                        <div className="relative">
                            <select
                                ref={currencyInputRef}
                                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            >
                                <option defaultValue value="">Choose Currency</option>
                                {currency.map((curr, index) => (
                                    <option key={index} value={curr.id}>{curr.code}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-full px-3 mb-6 md:mb-0 py-4 px-4">
                        <label
                            className="block uppercase text-gray-600 text-xs font-bold mb-2"
                            htmlFor="amount"
                        >
                            Amount:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="amount"
                            type="number"
                            placeholder="Amount"
                            required
                            ref={amountInputRef}
                        />
                    </div>
                    <div className="flex items-center justify-end px-5">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline px-10"
                            type="submit"
                        >
                            Send Money
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
