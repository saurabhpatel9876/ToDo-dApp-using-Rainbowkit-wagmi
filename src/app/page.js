"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { contractABI } from "@/blockchain/abi";
import Image from "next/image";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useAccount, usePublicClient, useReadContract, useWriteContract } from "wagmi";

const contractAddress = "0xfCDB8ef885873e53C9B9E75558bFC07306fD12b1"

export default function Home() {
  const inputRef = useRef(null)
 
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data, refetch } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "getTodos",
    args: [address],
    query: { enabled: !!address }
  })

  const userTodosCount = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "userTodoCount",
    args: [address],
    query: { enabled: !!address }
  })
  console.log('userTodosCount: ', userTodosCount.data);
  console.log('todos: ', data);



  const { writeContract } = useWriteContract({
    mutation: {
      onSuccess: async (data) => {
        console.log('data: ', data);
        await publicClient?.waitForTransactionReceipt({ hash: data });
        await refetch();
        console.log('mutation success');
      }
    }
  })

  const createTodo = () => {
    if (!inputRef.current && inputRef) return console.error("No input value")
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "createTodo",
      args: [inputRef],
    })

    // inputRef.current!.value = "";
  }

  const deleteTodo = (id) => {
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "deleteTodo",
      args: [id],
    })
  }

  const toggleTodo = (id) => {
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "toggleTodo",
      args: [id],
    })
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     <ConnectButton/>
   <div className="flex gap-5">
    <Input ref={inputRef}/>
    <Button onClick={() => createTodo()}>create new ToDo</Button>
   </div>

   <ul className="flex flex-col w-full max-w-[50rem]">
        {data?.map((el) => (
          <li key={el.id} className="flex gap-5 items-center border border-black rounded-lg p-2">
            <p className="border rounded-lg px-2">{el.isCompleted ? "Done" : "Pending"}</p>
            <p className="flex-1">{el.task}</p>
            <Button className="cursor-pointer active:scale-95" onClick={() => deleteTodo(el.id)}>Delete</Button>
            <Button className="cursor-pointer active:scale-95" onClick={() => toggleTodo(el.id)}>Toggle</Button>
          </li>
        ))}
      </ul>
     
    </main>
  );
}
