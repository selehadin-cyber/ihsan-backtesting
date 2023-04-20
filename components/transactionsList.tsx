import React, { FC } from 'react'
import { Transactions } from './LineChart'

interface TransactionsProp{
    transactionsList: Transactions[]
}

const TransactionsList: React.FC<TransactionsProp> = ({transactionsList}) => {
const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
  return (
    <div className='w-full'>
        <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Stock name
                </th>
                <th scope="col" className="px-6 py-3">
                    Date
                </th>
                <th scope="col" className="px-6 py-3">
                    Quantity
                </th>
                <th scope="col" className="px-6 py-3">
                    Type
                </th>
                <th scope="col" className="px-6 py-3">
                    Price
                </th>
                <th scope="col" className="px-6 py-3">
                    Balance
                </th>
            </tr>
        </thead>
        <tbody>
            
                {transactionsList && transactionsList.map((e: Transactions) => (
                 <tr>
                    <td>
                       {e.stock} 
                    </td>
                    <td>
                       {e.date} 
                    </td>
                    
                    <td>
                       {Math.round(e.quantity)} 
                    </td>
                    <td>
                       {e.type} 
                    </td>
                    <td>
                       {formatter.format(e.price)} 
                    </td>
                    <td>
                       {formatter.format(e.balance)} 
                    </td>
                </tr>
                ))}
            
        </tbody>
    </table>
    </div>
  )
}

export default TransactionsList