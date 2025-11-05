using System;
using System.Collections.Generic;
using UnityEngine;

namespace NeoCourier.Missions
{
    /// <summary>
    /// Generates and tracks procedurally composed daily missions.
    /// </summary>
    public class DailyMissionManager : MonoBehaviour
    {
        [Serializable]
        public class MissionDefinition
        {
            public string id;
            public string localizationKey;
            public MissionType missionType;
            public int baseReward;
        }

        public enum MissionType
        {
            DeliveryRoute,
            MiniGameChallenge,
            Battle,
            StoryDelivery
        }

        [SerializeField] private List<MissionDefinition> missionPool = new List<MissionDefinition>();
        [SerializeField, Range(1, 5)] private int missionsPerDay = 3;

        private readonly List<MissionDefinition> _activeMissions = new List<MissionDefinition>();
        private DateTime _lastGeneratedDate;

        public event Action<IReadOnlyList<MissionDefinition>> OnMissionsUpdated;

        public IReadOnlyList<MissionDefinition> ActiveMissions => _activeMissions;

        private void Start()
        {
            InitializeDailyMissions();
        }

        public void InitializeDailyMissions()
        {
            if (_lastGeneratedDate.Date != DateTime.UtcNow.Date || _activeMissions.Count == 0)
            {
                GenerateDailyMissions();
            }
            else
            {
                OnMissionsUpdated?.Invoke(_activeMissions);
            }
        }

        public void GenerateDailyMissions()
        {
            _activeMissions.Clear();

            List<MissionDefinition> shuffled = new List<MissionDefinition>(missionPool);
            for (int i = 0; i < shuffled.Count; i++)
            {
                int swapIndex = UnityEngine.Random.Range(i, shuffled.Count);
                (shuffled[i], shuffled[swapIndex]) = (shuffled[swapIndex], shuffled[i]);
            }

            for (int i = 0; i < Mathf.Min(missionsPerDay, shuffled.Count); i++)
            {
                _activeMissions.Add(shuffled[i]);
            }

            _lastGeneratedDate = DateTime.UtcNow.Date;
            OnMissionsUpdated?.Invoke(_activeMissions);
        }

        public void CompleteMission(string missionId)
        {
            MissionDefinition mission = _activeMissions.Find(m => m.id == missionId);
            if (mission != null)
            {
                _activeMissions.Remove(mission);
                OnMissionsUpdated?.Invoke(_activeMissions);
            }
        }

        public void FailMission(string missionId)
        {
            Debug.LogWarning($"Mission failed: {missionId}");
        }
    }
}
