using System.Collections.Generic;
using UnityEngine;

namespace NeoCourier.Story
{
    /// <summary>
    /// Handles branching narrative events triggered by mission outcomes.
    /// </summary>
    [CreateAssetMenu(fileName = "StoryDirector", menuName = "NeoCourier/StoryDirector")]
    public class StoryDirector : ScriptableObject
    {
        [System.Serializable]
        public class StoryNode
        {
            public string id;
            public string dialogueKey;
            public List<StoryChoice> choices;
        }

        [System.Serializable]
        public class StoryChoice
        {
            public string descriptionKey;
            public string nextNodeId;
            public string requiredMissionId;
        }

        [SerializeField] private StoryNode startingNode;
        [SerializeField] private List<StoryNode> nodes = new List<StoryNode>();

        private readonly Dictionary<string, StoryNode> _nodeLookup = new Dictionary<string, StoryNode>();
        private StoryNode _currentNode;

        public delegate void StoryUpdated(StoryNode node);
        public event StoryUpdated OnStoryUpdated;

        public void InitializeStory()
        {
            _nodeLookup.Clear();
            foreach (StoryNode node in nodes)
            {
                _nodeLookup[node.id] = node;
            }

            _currentNode = startingNode;
            OnStoryUpdated?.Invoke(_currentNode);
        }

        public void AdvanceStory(string missionId)
        {
            if (_currentNode?.choices == null) return;

            foreach (StoryChoice choice in _currentNode.choices)
            {
                if (choice.requiredMissionId == missionId && _nodeLookup.TryGetValue(choice.nextNodeId, out StoryNode next))
                {
                    _currentNode = next;
                    OnStoryUpdated?.Invoke(_currentNode);
                    return;
                }
            }
        }
    }
}
