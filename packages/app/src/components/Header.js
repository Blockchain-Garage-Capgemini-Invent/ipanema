import './Header.css';

function Header() {
    return(
        <div>
            <nav class="Navigation">
                <ul>
                    {/* --- --- --- --- --- Header + Space --- --- --- --- --- */}
                    <li><div class="HeaderTitle">Ipanema</div></li>
                    <li><button class="HeaderSpace"></button></li>
                    
                    {/* --- --- --- --- --- Platform Select + Space --- --- --- --- --- */}
                    <li><button class="PlatformButton">
                        <ul>
                            <li><img src={require('./ethereumlogo.png')} width="25" height="25" class="PlatformButtonImage"/></li>
                            <li><div class="PlatformButtonText">Ethereum Mainnet</div></li>
                        </ul>
                        </button>
                    </li>
                    <li><button class="HeaderSpace"></button></li>
                    
                    {/* --- --- --- --- --- Wallet Select + Space --- --- --- --- --- */}
                    <li><button class="WalletButton">Connect Wallet</button></li>
                </ul>
            </nav>
            <hr class="HorizontalLine"/>
        </div>
    );
}

export default Header
