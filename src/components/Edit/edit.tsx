"use client";
import { useHabitContext } from "@/context/habitContext";
import { ChangeEvent, useEffect, useState } from "react";
import { TbTrashXFilled, TbPencil } from "react-icons/tb";
import { LiaSave } from "react-icons/lia";
import { TiCancel } from "react-icons/ti";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Edit() {
  const {
    habit,
    fetched,
    fetchFromStore,
    checkDate,
    editList,
    deleteHabit,
    addHabit,
  } = useHabitContext();
  const [newHabit, setNewHabit] = useState<string>("");
  const [editing, setEditing] = useState<{
    index: number;
    old: string;
    new: string;
  }>({ index: -1, old: "", new: "" });

  useEffect(() => {
    if (!fetched) {
      fetchFromStore();
      return;
    }
    checkDate();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setNewHabit(value);
  };

  const handleAdd = async () => {
    if (newHabit === "") return;
    if (habit.habitList.habits.find((value) => value.habit === newHabit)) {
      setNewHabit("");
      return;
    }
    addHabit(newHabit);
    setNewHabit("");
  };

  const handleDelete = (index: number) => {
    deleteHabit(index);
  };

  const startEditing = (index: number, old: string) => {
    setEditing({ index, old, new: old });
  };

  const saveCancel = (save: boolean) => {
    if (save) {
      editList(editing);
    }
    setEditing({ index: -1, old: "", new: "" });
  };

  const handleChangeEdit = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setEditing((prevState) => ({ ...prevState, new: value }));
  };

  return (
    <div className="flex justify-center items-center gap-3 min-w-full bg-slate-700 py-5 absolute flex-col">
      <Card className="w-11/12 max-w-4xl">
        <CardHeader>
          <CardTitle>Add new Habit</CardTitle>
          <CardContent>
            <Input value={newHabit} onChange={handleChange} />
            <Button className="my-3 px-9" onClick={handleAdd}>
              Add
            </Button>
          </CardContent>
        </CardHeader>
      </Card>
      {habit?.habitList?.habits &&
        habit?.habitList?.habits.map((item, index) => (
          <Card className="w-11/12 max-w-4xl" key={item.habit}>
            <CardContent className="p-4 flex justify-between items-center">
              {index === editing.index ? (
                <>
                  <div className="text-xl w-11/12">
                    <Input
                      value={editing.new}
                      className="w-full"
                      onChange={handleChangeEdit}
                    />
                  </div>
                  <div className="flex gap-2">
                    <LiaSave
                      size={"1.4rem"}
                      className="cursor-pointer"
                      onClick={(_: any) => saveCancel(true)}
                    />
                    <TiCancel
                      size={"1.4rem"}
                      className="cursor-pointer"
                      onClick={(_: any) => saveCancel(false)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xl">{item.habit}</div>
                  <div className="flex gap-2">
                    <TbPencil
                      size={"1.4rem"}
                      className="cursor-pointer"
                      onClick={(_: any) => startEditing(index, item.habit)}
                    />
                    <TbTrashXFilled
                      size={"1.4rem"}
                      className="cursor-pointer"
                      onClick={(_: any) => handleDelete(index)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
