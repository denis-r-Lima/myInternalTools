"use client";
import { useLoading } from "@/context/loadingContext";
import { getAuth, getIdToken } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { FaRegEdit, FaRegWindowClose } from "react-icons/fa";
import EditModal from "./editModal";
import { ChevronDown, ChevronUp } from "lucide-react";

type GymType = {
  days: {
    exercises: { name: string; weight: number; set: string; gifUrl: string }[];
  }[];
};

const Gym: React.FC = () => {
  const { setLoadingData } = useLoading();
  const [gym, setGym] = useState<GymType>({ days: [] });
  const [showingDay, setShowingDay] = useState(0);
  const [newExercise, setNewExercise] = useState({
    name: "",
    weight: 0,
    set: "",
    gifUrl: "",
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
      gifUrl: "",
    });

    setOpenPopUp(false);
  };
  const handleChange = (e: {
    currentTarget: { name: string; value: string };
  }) => {
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

  const handleDeleteDay = () => {
    const temp: GymType = {
      days: gym.days.filter((_, idx) => idx !== showingDay),
    };
    setShowingDay((prevState) => (prevState === 0 ? 0 : prevState - 1));
    updateStore(temp);
  };

  const moveCard = (currentIdx: number, nextIdx: number) => {
    if (nextIdx < 0 || nextIdx >= gym.days[showingDay].exercises.length) return;
    const temp: GymType = {
      days: gym.days.map((d, idx) => {
        if (idx !== showingDay) return d;
        const memo = d.exercises[currentIdx];
        d.exercises[currentIdx] = d.exercises[nextIdx];
        d.exercises[nextIdx] = memo;
        return d;
      }),
    };
    updateStore(temp);
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
              <ChevronUp onClick={() => moveCard(index, index - 1)} />
              <CardTitle>
                {e.name.charAt(0).toUpperCase() + e.name.slice(1)}
              </CardTitle>
              <div className="flex-row flex relative bottom-5 gap-2 p-2">
                <FaRegEdit
                  onClick={() => handleEdit(index)}
                  fontSize={"1.3rem"}
                />
                <FaRegWindowClose
                  onClick={() => handleDelete(index)}
                  fontSize={"1.3rem"}
                />
              </div>
            </CardHeader>
            <CardContent className="flex flex-row justify-between px-6">
              {e.gifUrl !== "" && (
                <div className="w-12/12 flex justify-center m-auto">
                  <img src={e.gifUrl} className="max-w-xs w-9/12" />
                </div>
              )}
              <div className="flex flex-col justify-end items-start">
                <h1 className="text-lg">
                  <b>Weight: </b>
                  {e.weight} lb
                </h1>
                <h1 className="text-lg">
                  <b>Reps: </b>
                  {e.set}
                </h1>
              </div>
            </CardContent>
            <CardFooter>
              <ChevronDown onClick={() => moveCard(index, index + 1)} />
            </CardFooter>
          </Card>
        ))}
        <Button
          className="bg-slate-200 text-slate-700 hover:text-slate-200"
          onClick={() => handleDeleteDay()}
        >
          Delete Day
        </Button>
      </div>
      {openPopUp && (
        <EditModal
          addEdit={addEdit}
          newExercise={newExercise}
          handleChange={handleChange}
          editingIndex={editingIndex}
        />
      )}
    </>
  );
};

export default Gym;
