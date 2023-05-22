import React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Order } from "../../types/Order";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import InputAdornment from "@mui/material/InputAdornment";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import HomeIcon from "@mui/icons-material/Home";
import IconText from "../common/IconText";
import EmailIcon from "@mui/icons-material/Email";
import { COST_PER_ORDER } from "../../constants";
import { SxProps } from "@mui/system";
import IconTextField from "../common/IconTextField";
import CampaignIcon from "@mui/icons-material/Campaign";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ButtonGroup from "@mui/material/ButtonGroup";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Theme, useTheme } from "@mui/material";
import useEditOrder from "../../hooks/useEditOrder";
import { useQueryClient } from "@tanstack/react-query";

function SubsectionTitle({ title, sx, button }: { title: string, sx?: SxProps, button?: React.ReactNode }) {
    return (<Typography variant="h6" sx={{ ...sx, fontWeight: "bold" }}>{title}{button}</Typography>);
}

function ToggleButton({ value, handleToggle, label, theme }:
    {
        value: boolean,
        handleToggle: React.MouseEventHandler<HTMLButtonElement>,
        label: string,
        theme: Theme
    }
) {
    return (
        <Button
            variant="outlined"
            sx={{
                backgroundColor: value ? theme.palette.success.light : theme.palette.error.light,
                borderRadius: 5,
                textTransform: "none",
                ":hover": {
                    background: value ? theme.palette.success.light : theme.palette.error.light
                }
            }}
            onClick={handleToggle}
            disableRipple
        >
            {label}
        </Button>
    );
}

export default function EditOrder(
    {
        order,
        setOpenSnackbar,
        setSnackbarMessage
    }: {
        order: Order,
        setOpenSnackbar(boolean): void,
        setSnackbarMessage(string): void
    }) {
    // TODO: Add additional donation to object
    // TODO: Use less use states

    const theme = useTheme();
    const queryClient = useQueryClient();
    const editOrderMutation = useEditOrder(queryClient);

    const [open, setOpen] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);

    const [newOrder, setNewOrder] = React.useState<Order>({ ...order });

    const [total, setTotal] = React.useState(0);
    const [balance, setBalance] = React.useState(0);

    React.useEffect(() => {
        setTotal((newOrder.boxesForCustomer + newOrder.boxesForAFAC) * COST_PER_ORDER);
    }, [newOrder.boxesForCustomer, newOrder.boxesForAFAC, setTotal]);

    React.useEffect(() => {
        const calculateBalance = ((newOrder.boxesForCustomer + newOrder.boxesForAFAC) * COST_PER_ORDER) - newOrder.amountPaid;
        if (isNaN(calculateBalance)) {
            setBalance(0);
        } else {
            setBalance(((newOrder.boxesForCustomer + newOrder.boxesForCustomer) * COST_PER_ORDER) - newOrder.amountPaid);
        }
    }, [newOrder.boxesForCustomer, newOrder.boxesForAFAC, newOrder.amountPaid, setBalance]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
        setIsEditing(false);
        setNewOrder({ ...order });
    };

    const handleSave = async () => {
        try {
            await editOrderMutation.mutateAsync(newOrder);
            setSnackbarMessage("Edit Successful");
            setOpenSnackbar(true);
            setOpen(false);
            setIsEditing(false);
        } catch {
            setSnackbarMessage("Something went wrong. Please contact an administrator");
            setOpenSnackbar(true);
            setOpen(false);
        }
    };

    const orderDetailsRows = [
        {
            name: "Self",
            increment: () => setNewOrder(newOrder => ({ ...newOrder, boxesForCustomer: newOrder.boxesForCustomer + 1 })),
            decrement: () => setNewOrder(newOrder => ({ ...newOrder, boxesForCustomer: Math.max(0, newOrder.boxesForCustomer - 1) })),
            value: newOrder.boxesForCustomer,
        },
        {
            name: "AFAC",
            increment: () => setNewOrder(newOrder => ({ ...newOrder, boxesForAFAC: newOrder.boxesForAFAC + 1 })),
            decrement: () => setNewOrder(newOrder => ({ ...newOrder, boxesForAFAC: Math.max(0, newOrder.boxesForAFAC - 1) })),
            value: newOrder.boxesForAFAC,
        }
    ];

    const customerDetails = [
        {
            value: newOrder.email,
            handleChange: (e) => setNewOrder(newOrder => ({ ...newOrder, email: e.target.value })),
            icon: <EmailIcon fontSize="small" color="secondary" />,
            label: "Email"
        },
        {
            value: newOrder.cellPhone,
            handleChange: (e) => setNewOrder(newOrder => ({ ...newOrder, cellPhone: e.target.value })),
            icon: <SmartphoneIcon fontSize="small" color="secondary" />,
            label: "Cell Phone"
        },
        {
            value: newOrder.homePhone,
            handleChange: (e) => setNewOrder(newOrder => ({ ...newOrder, homePhone: e.target.value })),
            icon: <HomeIcon fontSize="small" color="secondary" />,
            label: "Home Phone"
        },
        {
            value: newOrder.howDidYouHearAboutUs,
            handleChange: (e) => setNewOrder(newOrder => ({ ...newOrder, howDidYouHearAboutUs: e.target.value })),
            icon: <CampaignIcon fontSize="small" color="secondary" />,
            label: "Referred By"
        },
    ];

    return (
        <>
            <IconButton onClick={handleOpen}><EditIcon /></IconButton>
            <Dialog open={open} onClose={handleCancel} maxWidth='sm' fullWidth>
                {isEditing
                    ?
                    <Stack my={2} direction="row" justifyContent="space-around">
                        <TextField
                            size="small"
                            type="text"
                            value={newOrder.firstName}
                            label="First Name"
                            onChange={(e) => setNewOrder(newOrder => ({ ...newOrder, firstName: e.target.value }))}
                        />
                        <TextField
                            size="small"
                            type="text"
                            value={newOrder.lastName}
                            onChange={(e) => setNewOrder(newOrder => ({ ...newOrder, lastName: e.target.value }))}
                            label="Last Name"
                            sx={{
                                ml: 1
                            }}
                        />
                    </Stack>
                    : <DialogTitle> {`${newOrder.firstName} ${newOrder.lastName}`}</DialogTitle>
                }
                <Divider sx={{ backgroundColor: theme.palette.primary.main, height: "3px" }} />
                <DialogContent>
                    <Box sx={{ mx: 2 }}>
                        <SubsectionTitle
                            title={"Customer Details"}
                            button={
                                <IconButton onClick={() => setIsEditing(!isEditing)}>
                                    <EditIcon sx={{ ml: 0.5, fontSize: "20px" }} />
                                </IconButton>
                            }
                        />
                        {isEditing
                            ?
                            <Stack>
                                {
                                    customerDetails.map((details) => (
                                        <IconTextField
                                            key={details.label}
                                            icon={details.icon}
                                            value={details.value}
                                            onChange={details.handleChange}
                                            label={details.label}
                                        />
                                    ))
                                }
                            </Stack>
                            : <>
                                {
                                    customerDetails.map((details) => (
                                        <IconText
                                            key={details.label}
                                            icon={details.icon}
                                            variant="body2"
                                        >
                                            {details.value}
                                        </IconText>
                                    ))
                                }
                            </>
                        }
                        <Divider sx={{ my: 1, backgroundColor: theme.palette.primary.main, height: "1px" }} />
                        <SubsectionTitle title={"Order Details"} />
                        <Table sx={{
                            [`& .${tableCellClasses.root}`]: {
                                borderBottom: "none"
                            },
                            mb: 2
                        }} >
                            <TableHead sx={{ fontWeight: "bold" }}>
                                <TableRow>
                                    <TableCell><Typography>Category</Typography></TableCell>
                                    <TableCell align="center"><Typography>Boxes</Typography></TableCell>
                                    <TableCell align="right"><Typography>Cost</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {orderDetailsRows.map((row) => (
                                    <TableRow
                                        key={row.name}
                                    >
                                        <TableCell component="th" scope="row">
                                            <Typography>{row.name}</Typography>
                                        </TableCell>
                                        <TableCell align="center" >
                                            <ButtonGroup >
                                                <Button onClick={row.increment}>+</Button>
                                                <Button disableRipple>{row.value}</Button>
                                                <Button onClick={row.decrement} >-</Button>
                                            </ButtonGroup>
                                        </TableCell>

                                        <TableCell align="right">
                                            <Typography variant="body1">${row.value * COST_PER_ORDER}</Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow sx={{ borderTop: 1, borderColor: "primary" }}>
                                    <TableCell><Typography>Total</Typography></TableCell>
                                    <TableCell align="center">
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body1">${total}</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <SubsectionTitle title="Payment Details" />
                        <TableContainer>
                            <Table sx={{
                                [`& .${tableCellClasses.root}`]: {
                                    borderBottom: "none"
                                },
                                mb: 2
                            }} >
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th">
                                            <Typography>Payment Method</Typography>
                                        </TableCell>
                                        <TableCell >
                                            <Box sx={{ minWidth: 120 }}>
                                                <FormControl fullWidth>
                                                    <Select
                                                        value={newOrder.method}
                                                        onChange={(e) => setNewOrder(newOrder => ({ ...newOrder, method: e.target.value }))}
                                                    >
                                                        <MenuItem value="Cash">Cash</MenuItem>
                                                        <MenuItem value="Credit Card">Credit Card</MenuItem>
                                                        <MenuItem value="Check">Check</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th">
                                            <Typography>Paid</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <ToggleButton
                                                theme={theme}
                                                value={newOrder.paid}
                                                handleToggle={() => setNewOrder(newOrder => ({ ...newOrder, paid: !newOrder.paid }))}
                                                label={newOrder.paid ? "Yes" : "No"} />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="line">
                                            <Typography>Amount Paid</Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            <TextField
                                                size="small"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                }}
                                                type="number"
                                                value={newOrder.amountPaid}
                                                inputProps={{
                                                    step: 1
                                                }}
                                                onChange={(e) => setNewOrder(newOrder => ({ ...newOrder, amountPaid: parseFloat(e.target.value) }))}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="line">
                                            <Typography>Balance</Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Typography pl="14px">{`${balance < 0 ? "-" : ""} $ ${Math.abs(balance).toFixed(2)}`}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="line">
                                            <Typography>Additional Donation</Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            <TextField
                                                size="small"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                }}
                                                type="number"
                                                value={newOrder.additionalDonation}
                                                inputProps={{
                                                    step: 1
                                                }}
                                                onChange={(e) => setNewOrder(newOrder => ({ ...newOrder, additionalDonation: parseFloat(e.target.value) }))}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <SubsectionTitle title="Order Status" sx={{ mt: 2 }} />
                                    <TableRow>
                                        <TableCell component="th">
                                            <Typography>Picked Up</Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            <ToggleButton
                                                theme={theme}
                                                value={newOrder.pickedUp}
                                                handleToggle={() => setNewOrder(newOrder => ({ ...newOrder, pickedUp: !newOrder.pickedUp }))}
                                                label={newOrder.pickedUp ? "Yes" : "No"}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button sx={{ backgroundColor: theme.palette.error.main }} onClick={handleCancel}>Cancel</Button>
                    <Button sx={{ backgroundColor: theme.palette.success.main }} onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog >
        </>
    );
}
