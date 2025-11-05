using System.Collections.Generic;
using UnityEngine;

namespace NeoCourier.Gameplay
{
    /// <summary>
    /// Handles registration and launching of quick minigames.
    /// </summary>
    public class MiniGameController : MonoBehaviour
    {
        [System.Serializable]
        public class MiniGame
        {
            public string id;
            public string displayNameKey;
            public GameObject prefab;
        }

        [SerializeField] private List<MiniGame> miniGames = new List<MiniGame>();
        [SerializeField] private Transform miniGameAnchor;

        private GameObject _currentInstance;

        public void LaunchMiniGame(string miniGameId)
        {
            CleanupCurrentMiniGame();
            MiniGame definition = miniGames.Find(m => m.id == miniGameId);
            if (definition == null)
            {
                Debug.LogWarning($"MiniGame not found: {miniGameId}");
                return;
            }

            _currentInstance = Instantiate(definition.prefab, miniGameAnchor);
        }

        public void CompleteMiniGame()
        {
            CleanupCurrentMiniGame();
        }

        private void CleanupCurrentMiniGame()
        {
            if (_currentInstance != null)
            {
                Destroy(_currentInstance);
                _currentInstance = null;
            }
        }
    }
}
