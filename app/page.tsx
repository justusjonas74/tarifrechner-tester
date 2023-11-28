"use client"
import App from "@/components/App";
// import Image from 'next/image'
// import styles from './page.module.css'

import StopBox from "@/components/StopBox";
import { IPoint, IStop } from "dvbjs";



export default function Home() {

  const handleNewSelectedStop = (stop: IPoint) => {
    alert(stop.name)
  }
  return (
    <App />
  )
}
