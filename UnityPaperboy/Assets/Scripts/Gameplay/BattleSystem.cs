using System;
using UnityEngine;

namespace NeoCourier.Gameplay
{
    /// <summary>
    /// Turn-based battle manager for rival couriers and drones.
    /// </summary>
    public class BattleSystem : MonoBehaviour
    {
        [Serializable]
        public class Combatant
        {
            public string nameKey;
            public int maxHealth = 100;
            public int currentHealth = 100;
            public int attackPower = 15;
            public int specialPower = 30;
        }

        public enum BattleState
        {
            PlayerTurn,
            EnemyTurn,
            Victory,
            Defeat
        }

        [SerializeField] private Combatant player;
        [SerializeField] private Combatant enemy;

        public BattleState CurrentState { get; private set; } = BattleState.PlayerTurn;

        public event Action<BattleState> OnBattleStateChanged;

        private void Start()
        {
            player.currentHealth = player.maxHealth;
            enemy.currentHealth = enemy.maxHealth;
            OnBattleStateChanged?.Invoke(CurrentState);
        }

        public void PlayerAttack()
        {
            if (CurrentState != BattleState.PlayerTurn) return;

            DealDamage(enemy, player.attackPower);
            if (enemy.currentHealth <= 0)
            {
                CurrentState = BattleState.Victory;
                OnBattleStateChanged?.Invoke(CurrentState);
                return;
            }

            CurrentState = BattleState.EnemyTurn;
            OnBattleStateChanged?.Invoke(CurrentState);
            EnemyAction();
        }

        public void PlayerSpecial()
        {
            if (CurrentState != BattleState.PlayerTurn) return;

            DealDamage(enemy, player.specialPower);
            player.currentHealth = Mathf.Min(player.maxHealth, player.currentHealth + 10);
            if (enemy.currentHealth <= 0)
            {
                CurrentState = BattleState.Victory;
                OnBattleStateChanged?.Invoke(CurrentState);
                return;
            }

            CurrentState = BattleState.EnemyTurn;
            OnBattleStateChanged?.Invoke(CurrentState);
            EnemyAction();
        }

        private void EnemyAction()
        {
            if (CurrentState != BattleState.EnemyTurn) return;

            DealDamage(player, enemy.attackPower);
            if (player.currentHealth <= 0)
            {
                CurrentState = BattleState.Defeat;
            }
            else
            {
                CurrentState = BattleState.PlayerTurn;
            }

            OnBattleStateChanged?.Invoke(CurrentState);
        }

        private void DealDamage(Combatant target, int amount)
        {
            target.currentHealth = Mathf.Max(0, target.currentHealth - amount);
        }
    }
}
