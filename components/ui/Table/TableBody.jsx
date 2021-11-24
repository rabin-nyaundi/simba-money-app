export default function TableBody({ transactions, session }) {
    return (
        <>
            <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((item, key) => (
                    <tr key={key}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{key + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sender.name || null}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.receiver.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{"USD"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.currency.code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.value}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {item.status ?
                                <>
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Completed
                                    </span>
                                </> :
                                <>
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                        Failed
                                    </span>
                                </>}
                        </td>

                    </tr>
                ))}
            </tbody>
        </>
    )
}
