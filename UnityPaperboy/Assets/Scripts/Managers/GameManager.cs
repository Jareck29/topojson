using NeoCourier.Missions;
using NeoCourier.Story;
using UnityEngine;

namespace NeoCourier.Managers
{
    /// <summary>
    /// Central orchestrator: handles mission rotation, story progression and state persistence.
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        [SerializeField] private DailyMissionManager missionManager;
        [SerializeField] private StoryDirector storyDirector;

        public static GameManager Instance { get; private set; }

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        private void Start()
        {
            missionManager?.InitializeDailyMissions();
            storyDirector?.InitializeStory();
        }

        public void CompleteMission(string missionId)
        {
            missionManager?.CompleteMission(missionId);
            storyDirector?.AdvanceStory(missionId);
        }

        public void FailMission(string missionId)
        {
            missionManager?.FailMission(missionId);
        }
    }
}
