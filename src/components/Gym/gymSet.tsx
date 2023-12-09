"use client";
import { useLoading } from "@/context/loadingContext";
import { getAuth, getIdToken } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

import { FaRegEdit, FaRegWindowClose } from "react-icons/fa";

type GymType = {
  days: { exercises: { name: string; weight: number; set: string }[] }[];
};

const Gym: React.FC = () => {
  const { setLoadingData } = useLoading();
  const [gym, setGym] = useState<GymType>({ days: [] });
  const [showingDay, setShowingDay] = useState(0);
  const [newExercise, setNewExercise] = useState({
    name: "",
    weight: 0,
    set: "",
  });
  const [editingIndex, setEditingIndex] = useState(-1);
  const [openPopUp, setOpenPopUp] = useState(false);

  const fetchFromStore = useCallback(async () => {
    const auth = getAuth();
    if (!auth.currentUser) return;
    try {
      setLoadingData(true);
      const token = await getIdToken(auth.currentUser);
      const result = await fetch(`/api/gym`, { headers: { token } });
      const data: GymType = await result.json();
      setGym(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchFromStore();
  }, [fetchFromStore]);

  const updateStore = async (data: GymType) => {
    const auth = getAuth();
    if (!auth.currentUser) return;
    try {
      setLoadingData(true);
      const token = await getIdToken(auth.currentUser);
      await fetch("/api/gym", {
        method: "PUT",
        body: JSON.stringify({
          data: data,
        }),
        headers: { token },
      });

      setGym(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  const addDay = async () => {
    const temp: GymType = { days: [...gym.days, { exercises: [] }] };
    updateStore(temp);
  };

  const clickDay = (day: number) => {
    if (day === showingDay) return;
    setShowingDay(day);
  };

  const handleOpen = (index: number = -1) => {
    if (index === -1) setOpenPopUp(true);
  };

  const addEdit = (ok: boolean = false) => {
    if (ok) {
      const temp: GymType = {
        days: gym.days.map((d, idx) => {
          if (idx !== showingDay) return d;
          return {
            exercises:
              editingIndex < 0
                ? [...d.exercises, newExercise]
                : d.exercises.map((e, idx) =>
                    idx !== editingIndex ? e : newExercise
                  ),
          };
        }),
      };
      updateStore(temp);
    }
    setEditingIndex(-1);
    setNewExercise({
      name: "",
      weight: 0,
      set: "",
    });

    setOpenPopUp(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.currentTarget;
    setNewExercise((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleDelete = (index: number) => {
    const temp: GymType = {
      days: gym.days.map((d, idx) =>
        idx !== showingDay
          ? d
          : { exercises: d.exercises.filter((_, i) => i !== index) }
      ),
    };
    updateStore(temp);
  };

  const handleEdit = (index: number) => {
    setNewExercise(gym.days[showingDay].exercises[index]);
    setEditingIndex(index);
    setOpenPopUp(true);
  };

  return (
    <>
      <div className="w-10/12 max-w-3xl flex flex-row flex-wrap gap-4 mx-auto justify-center">
        {gym.days.map((_, index) => (
          <div
            className={`px-5 py-1 rounded-full border-slate-200 border-2 ${
              index === showingDay
                ? "bg-slate-700 text-slate-200 cursor-default"
                : "bg-slate-200 cursor-pointer"
            }`}
            key={index}
            onClick={() => clickDay(index)}
          >
            Day {index + 1}
          </div>
        ))}

        <div
          className="px-3 py-1 bg-slate-200 rounded-full cursor-pointer"
          onClick={addDay}
        >
          +
        </div>
      </div>
      <div className="w-10/12 max-w-3xl flex flex-col flex-wrap gap-4 mx-auto justify-center mt-7">
        <Button
          className="bg-slate-200 text-slate-700 hover:text-slate-200"
          onClick={() => handleOpen()}
        >
          Add exercise
        </Button>
        {gym.days[showingDay]?.exercises?.map((e, index) => (
          <Card key={e.name}>
            <CardHeader className="flex-row justify-between items-center">
              <CardTitle>{e.name}</CardTitle>
              <div className="flex-row flex relative bottom-5 gap-2">
                <FaRegEdit onClick={() => handleEdit(index)} />
                <FaRegWindowClose onClick={() => handleDelete(index)} />
              </div>
            </CardHeader>
            <CardContent className="flex flex-row justify-between px-6">
              <h1 className="text-lg">
                <b>Weight: </b>
                {e.weight} lb
              </h1>
              <h1 className="text-lg">
                <b>Reps: </b>
                {e.set}
              </h1>
            </CardContent>
          </Card>
        ))}
      </div>
      {openPopUp && (
        <div
          className={`fixed top-0 left-0 right-0 bottom-0 bg-slate-600 bg-opacity-75 z-50 grid place-items-center`}
        >
          <Card className="w-11/12 max-w-2xl px-2 py-4">
            <CardContent className="flex flex-col gap-3">
              <Input
                placeholder="Exercise Name"
                name="name"
                value={newExercise.name}
                onChange={handleChange}
              />
              <Input
                placeholder="Weight"
                name="weight"
                value={newExercise.weight}
                onChange={handleChange}
                type="number"
              />
              <Input
                placeholder="Reps"
                name="set"
                value={newExercise.set}
                onChange={handleChange}
              />
              <Button onClick={() => addEdit(true)}>Ok</Button>
              <Button onClick={() => addEdit()}>Cancel</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default Gym;
