"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { OrderDetailsCard } from "./input-section/order-details-card";
import { TypeSelector, TYPE_NAMES } from "./input-section/type-selector";
import { MenuDetailsCard } from "./input-section/menu-details-card";
import { EmployeeInputs } from "./input-section/employee-inputs";

export default function InputSection(props) {
  const {
    handleSubmit,
    subBidang,
    setSubBidang,
    judulPekerjaan,
    setJudulPekerjaan,
    zonaWaktu,
    setZonaWaktu,
    dropPoint,
    setDropPoint,
    picName,
    setPicName,
    picPhone,
    setPicPhone,
    counts,
    handleCountChange,
    employees,
    handleEmployeeChange,
    bidangOptions,
    zonaWaktuOrder,
    plnipNames,
    menuOptions,
    syncMenuEnabled,
    setSyncMenuEnabled,
    anonymousEnabled,
    setAnonymousEnabled,
    setEmployees,
  } = props;

  const [activeTypes, setActiveTypes] = useState({});
  const [showAllTypes, setShowAllTypes] = useState(true);
  const [defaultSwitchesSet, setDefaultSwitchesSet] = useState(false);
  const [pendingTypeUpdate, setPendingTypeUpdate] = useState(null);

  // Set default switches on first render
  useEffect(() => {
    if (!defaultSwitchesSet) {
      // Set all types except PLNIP to have "Isi Anonim" on by default
      const defaultAnonymous = {};
      Object.keys(TYPE_NAMES).forEach((type) => {
        if (type !== "PLNIP") {
          defaultAnonymous[type] = true;
        }
      });
      setAnonymousEnabled(defaultAnonymous);

      // Set all types to have "Samakan Menu" on by default
      const defaultSync = {};
      Object.keys(TYPE_NAMES).forEach((type) => {
        defaultSync[type] = true;
      });
      setSyncMenuEnabled(defaultSync);

      setDefaultSwitchesSet(true);
    }
  }, []);

  // Handle count updates
  useEffect(() => {
    if (pendingTypeUpdate) {
      const { type, isActive } = pendingTypeUpdate;
      if (isActive) {
        handleCountChange(type, "1");

        if (!showAllTypes && type !== "PLNIP") {
          const updatedEmployees = { ...employees };
          const plnipFirstMenu = employees.PLNIP?.[0]?.menu;

          updatedEmployees[type] = Array(1).fill({
            name: `Pegawai ${type}`,
            menu: plnipFirstMenu,
            note: "",
          });

          setEmployees(updatedEmployees);
          setAnonymousEnabled((prev) => ({ ...prev, [type]: true }));
        }
      } else {
        handleCountChange(type, "0");
      }
      setPendingTypeUpdate(null);
    }
  }, [
    pendingTypeUpdate,
    handleCountChange,
    showAllTypes,
    employees,
    setEmployees,
    setAnonymousEnabled,
  ]);

  // Effect to sync other types with PLNIP when showAllTypes is false
  useEffect(() => {
    if (!showAllTypes) {
      const updatedEmployees = { ...employees };
      const plnipFirstMenu = employees.PLNIP?.[0]?.menu;

      Object.keys(employees).forEach((type) => {
        if (type !== "PLNIP") {
          updatedEmployees[type] = Array(counts[type]).fill({
            name: `Pegawai ${type}`,
            menu: plnipFirstMenu,
            note: "",
          });
        }
      });
      setEmployees(updatedEmployees);
    }
  }, [showAllTypes, employees.PLNIP, counts]);

  // Initialize active types based on counts
  useEffect(() => {
    const initialActiveTypes = {};
    Object.entries(counts).forEach(([type, count]) => {
      initialActiveTypes[type] = count > 0;
    });
    setActiveTypes(initialActiveTypes);
  }, [counts]);

  const handleTypeToggle = (type) => {
    setActiveTypes((prev) => {
      const newState = { ...prev, [type]: !prev[type] };
      setPendingTypeUpdate({ type, isActive: newState[type] });
      return newState;
    });
  };

  return (
    <div className="fixed left-64 top-[64px] flex h-[calc(100vh-64px)] w-[calc(100%-380px-256px)] flex-col border-none bg-[#fafbff] shadow-none">
      <ScrollArea className="flex-1 p-6">
        <form
          id="meal-order-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <OrderDetailsCard
            subBidang={subBidang}
            setSubBidang={setSubBidang}
            judulPekerjaan={judulPekerjaan}
            setJudulPekerjaan={setJudulPekerjaan}
            zonaWaktu={zonaWaktu}
            setZonaWaktu={setZonaWaktu}
            dropPoint={dropPoint}
            setDropPoint={setDropPoint}
            picName={picName}
            setPicName={setPicName}
            picPhone={picPhone}
            setPicPhone={setPicPhone}
            bidangOptions={bidangOptions}
            zonaWaktuOrder={zonaWaktuOrder}
          />

          <TypeSelector
            counts={counts}
            activeTypes={activeTypes}
            onTypeToggle={handleTypeToggle}
          />

          <MenuDetailsCard
            counts={counts}
            handleCountChange={handleCountChange}
            showAllTypes={showAllTypes}
            setShowAllTypes={setShowAllTypes}
            activeTypes={activeTypes}
            plnipNames={plnipNames}
            subBidang={subBidang}
            employees={employees}
            setEmployees={setEmployees}
            menuOptions={menuOptions}
            handleEmployeeChange={handleEmployeeChange}
            syncMenuEnabled={syncMenuEnabled}
            setSyncMenuEnabled={setSyncMenuEnabled}
            anonymousEnabled={anonymousEnabled}
            setAnonymousEnabled={setAnonymousEnabled}
          />
        </form>
      </ScrollArea>
    </div>
  );
}
