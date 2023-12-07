"use client";
import { getAuth, getIdToken } from "firebase/auth";
import { createContext, useContext, useState } from "react";
import { useLoading } from "@/context/loadingContext";

type TodayDataType = {
  date: string;
  habits: string[];
  completed: string[];
  notCompleted: string[];
};
type HabitListType = {
  habits: {
    habit: string;
    completion: { [year: string]: { [month: string]: number } };
  }[];
  perfectDays: number;
};
type HabitsType = { habitList: HabitListType; today: TodayDataType };

type HabitContextType = {
  habit: HabitsType;
  fetched: boolean;
  fetchFromStore: () => void;
  updateToday: (completed: boolean, habitCompleted: string) => void;
  checkDate: () => void;
  editList: (data: {
    old: string;
    new: string;
    index: number;
  }) => Promise<HabitsType | null>;
  deleteHabit: (index: number) => Promise<HabitsType | null>;
  addHabit: (data: string) => void;
};

const habitContext = createContext({} as HabitContextType);

const HabitContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [habit, setHabit] = useState({} as HabitsType);
  const [fetched, setFetched] = useState(false);
  const { setLoadingData } = useLoading();
  const date = new Date();

  const fetchFromStore = async () => {
    const auth = getAuth();
    if (!auth.currentUser) return;
    try {
      setLoadingData(true);
      const token = await getIdToken(auth.currentUser);
      const result = await fetch(`/api`, { headers: { token } });
      const data: HabitsType = await result.json();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const day = date.getDate();

      const currentDate = [month, day, year].join("-");
      if (currentDate != data.today.date) {
        resetToday(`${month}-${day}-${year}`, data);
      }

      setHabit(data);
      setFetched(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  const updateToday = async (completed: boolean, habitCompleted: string) => {
    const habitIndexList = habit.habitList.habits.findIndex(
      (val) => val.habit === habitCompleted
    );
    const habitIndex = habit.today.habits.indexOf(habitCompleted);
    const tempToday: TodayDataType = {
      ...habit.today,
      habits: habit.today.habits.filter((_, idx) => idx != habitIndex),
      completed: completed
        ? [...habit.today.completed, habitCompleted]
        : [...habit.today.completed],
      notCompleted: completed
        ? [...habit.today.notCompleted]
        : [...habit.today.notCompleted, habitCompleted],
    };
    const temp: HabitsType = { ...habit, today: tempToday };

    if (completed) {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      if (habitIndexList === -1) {
        return;
      } else if (
        temp.habitList.habits[habitIndexList].completion[`${year}`] ===
        undefined
      ) {
        temp.habitList.habits[habitIndexList].completion[`${year}`] = {};
        temp.habitList.habits[habitIndexList].completion[`${year}`][
          `${month}`
        ] = 1;
      } else if (
        temp.habitList.habits[habitIndexList].completion[`${year}`][
          `${month}`
        ] === undefined
      ) {
        temp.habitList.habits[habitIndexList].completion[`${year}`][
          `${month}`
        ] = 1;
      } else {
        temp.habitList.habits[habitIndexList].completion[`${year}`][
          `${month}`
        ]++;
      }
      if (
        temp.today.completed.length ===
        Object.keys(temp.habitList.habits).length
      ) {
        temp.habitList.perfectDays++;
      }
    }
    setLoadingData(true);
    setTimeout(() => {
      updateData(temp);
    }, 1000);
  };

  const resetToday = async (
    newDate: string,
    data: HabitsType
  ): Promise<HabitsType | null> => {
    const tempToday: TodayDataType = {
      date: newDate,
      habits: data.habitList.habits.map((val) => val.habit),
      completed: [],
      notCompleted: [],
    };
    const temp: HabitsType = { ...data, today: tempToday };
    return updateData(temp);
  };

  const checkDate = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const todayDate = [month, day, year].join("-");
    if (todayDate != habit.today.date) {
      fetchFromStore();
    }
  };

  const updateData = async (data: HabitsType): Promise<HabitsType | null> => {
    return new Promise(async (resolve, reject) => {
      const auth = getAuth();
      if (!auth.currentUser) return reject(null);
      try {
        setLoadingData(true);
        const token = await getIdToken(auth.currentUser);
        await fetch("/api", {
          method: "PUT",
          body: JSON.stringify({
            data: data,
          }),
          headers: { token },
        });
        setHabit(data);
        resolve(data);
      } catch (e) {
        console.error(e);
        reject(null);
      } finally {
        setLoadingData(false);
      }
    });
  };

  const editList = async (data: {
    old: string;
    new: string;
    index: number;
  }): Promise<HabitsType | null> => {
    const habits = habit.today.habits.map((val) =>
      val === data.old ? data.new : val
    );
    const completed = habit.today.completed.map((val) =>
      val === data.old ? data.new : val
    );
    const notCompleted = habit.today.notCompleted.map((val) =>
      val === data.old ? data.new : val
    );
    const temp: HabitsType = {
      today: { ...habit.today, habits, completed, notCompleted },
      habitList: {
        ...habit.habitList,
        habits: habit.habitList.habits.map((val, idx) =>
          idx === data.index ? { ...val, habit: data.new } : val
        ),
      },
    };
    return updateData(temp);
  };

  const deleteHabit = async (index: number): Promise<HabitsType | null> => {
    const completed = habit.today.completed.filter(
      (value) => value != habit.habitList.habits[index].habit
    );
    const pending = habit.today.habits.filter(
      (value) => value != habit.habitList.habits[index].habit
    );
    const incomplete = habit.today.notCompleted.filter(
      (value) => value != habit.habitList.habits[index].habit
    );
    const tempToday: TodayDataType = {
      ...habit.today,
      completed: completed,
      notCompleted: incomplete,
      habits: pending,
    };
    const temp: HabitsType = {
      habitList: {
        ...habit.habitList,
        habits: habit.habitList.habits.filter((_, idx) => idx != index),
      },
      today: tempToday,
    };
    return updateData(temp);
  };

  const addHabit = async (data: string) => {
    const temp: HabitsType = {
      ...habit,
      habitList: {
        ...habit.habitList,
        habits: [...habit.habitList.habits, { habit: data, completion: {} }],
      },
      today: { ...habit.today, habits: [...habit.today.habits, data] },
    };
    await updateData(temp);
    setHabit(temp);
  };

  return (
    <habitContext.Provider
      value={{
        habit,
        fetched,
        fetchFromStore,
        updateToday,
        checkDate,
        editList,
        deleteHabit,
        addHabit,
      }}
    >
      {children}
    </habitContext.Provider>
  );
};

export const useHabitContext = () => useContext(habitContext);

export default HabitContextProvider;
