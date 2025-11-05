using System.IO;
using UnityEngine;

namespace NeoCourier.Managers
{
    /// <summary>
    /// Saves and loads player progress including reputation and unlocked content.
    /// </summary>
    public class PlayerProgressManager : MonoBehaviour
    {
        private const string SaveFileName = "progress.json";

        [System.Serializable]
        private class SaveData
        {
            public int reputation;
            public int coins;
            public string lastDailyMissionDate;
        }

        public int Reputation { get; private set; }
        public int Coins { get; private set; }
        public string LastDailyMissionDate { get; private set; }

        private string SavePath => Path.Combine(Application.persistentDataPath, SaveFileName);

        private void Awake()
        {
            Load();
        }

        public void AddReputation(int amount)
        {
            Reputation += amount;
            Save();
        }

        public void AddCoins(int amount)
        {
            Coins += amount;
            Save();
        }

        public void SetLastDailyMissionDate(string date)
        {
            LastDailyMissionDate = date;
            Save();
        }

        private void Save()
        {
            SaveData data = new SaveData
            {
                reputation = Reputation,
                coins = Coins,
                lastDailyMissionDate = LastDailyMissionDate
            };

            string json = JsonUtility.ToJson(data);
            File.WriteAllText(SavePath, json);
        }

        private void Load()
        {
            if (!File.Exists(SavePath))
            {
                Reputation = 0;
                Coins = 0;
                LastDailyMissionDate = string.Empty;
                return;
            }

            string json = File.ReadAllText(SavePath);
            SaveData data = JsonUtility.FromJson<SaveData>(json);
            Reputation = data.reputation;
            Coins = data.coins;
            LastDailyMissionDate = data.lastDailyMissionDate;
        }
    }
}
