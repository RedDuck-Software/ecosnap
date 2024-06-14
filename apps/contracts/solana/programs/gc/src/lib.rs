use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod events;
pub mod instructions;
pub mod state;
pub mod utils;

use instructions::*;

declare_id!("5Mew5NxqLr5NGG6VbHtkNNK6LNGa5ucKyuV6stWmfy16");

#[program]
pub mod GC {
    use super::*;
}
