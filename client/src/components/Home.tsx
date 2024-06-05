import React, { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Container, Typography, Button } from "@mui/material"
import TransactionHistory from "./TransactionHistory"
import axios from "axios"

const Home: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const userData = response.data
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
      } catch (error) {
        console.error("Error fetching user data:", error)
        navigate("/login")
      }
    }

    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else if (location.state?.user) {
      setUser(location.state.user)
      localStorage.setItem("user", JSON.stringify(location.state.user))
    } else {
      fetchUser()
    }
  }, [location.state, navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h3" gutterBottom>
          User not found
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" gutterBottom>
        Hello {user.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Your balance:{" "}
        {location.state?.updatedBalance !== undefined
          ? location.state.updatedBalance
          : user.balance}
      </Typography>
      {user.balance < 15 ? <Typography variant="h3" gutterBottom color="red">
        Balance is less than 15!
      </Typography> : null}
      {location.state.balanceWarning && location.state.balanceWarning ? <Typography variant="h3" gutterBottom color="red">
        {location.state.balanceWarning}
      </Typography> : null}
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/transaction/form"
      >
        Make a Transaction
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogout}
        sx={{ marginLeft: "12px" }}
      >
        Logout
      </Button>
      <TransactionHistory />
    </Container>
  )
}

export default Home
