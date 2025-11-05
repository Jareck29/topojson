using System.Collections.Generic;
using System.Text;
using NeoCourier.Managers;
using NeoCourier.Missions;
using TMPro;
using UnityEngine;

namespace NeoCourier.Gameplay
{
    /// <summary>
    /// Renders active missions in the HUD using localized text.
    /// </summary>
    public class DailyMissionUI : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI missionListText;
        [SerializeField] private DailyMissionManager missionManager;

        private void OnEnable()
        {
            missionManager.OnMissionsUpdated += RenderMissions;
            RenderMissions(missionManager.ActiveMissions);
        }

        private void OnDisable()
        {
            missionManager.OnMissionsUpdated -= RenderMissions;
        }

        private void RenderMissions(IReadOnlyList<DailyMissionManager.MissionDefinition> missions)
        {
            if (missions == null) return;

            StringBuilder builder = new StringBuilder();
            foreach (DailyMissionManager.MissionDefinition mission in missions)
            {
                string title = LocalizationManager.Instance.GetText(mission.localizationKey);
                builder.AppendLine($"• {title}");
            }

            missionListText.text = builder.ToString();
        }
    }
}
