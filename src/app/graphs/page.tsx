'use server'
import { Chat } from "@/app/components/chat";
import * as neo4j from  'neo4j-driver';
import GraphData from './GraphData';
import dynamic from 'next/dynamic'


export const runtime = 'edge';
const driver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://demo.neo4jlabs.com',
    neo4j.auth.basic(
      process.env.NEO4J_USER || 'gameofthrones',
      process.env.NEO4J_PASSWORD || 'gameofthrones'
    ),
    {
      encrypted: process.env.NEO4J_ENCRYPTED ? 'ENCRYPTION_ON' : 'ENCRYPTION_OFF',
    }
  )

export default function Page() {

  return (
    <div>
        
         <h1>Hello</h1>
        {/* <GraphData driver={driver}/> */}
    </div>
  );
}

